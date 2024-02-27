const snoowrap = require("snoowrap");

// Reddit API credentials
const r = new snoowrap({
  userAgent: "Your app description",
  clientId: "your_client_id",
  clientSecret: "your_client_secret",
  username: "your_username",
  password: "your_password",
});

// Keywords to search for
const KEYWORDS = ["hire", "hiring", "frontend"];

// Subreddits to search in
const SUBREDDITS = ["subreddit1", "subreddit2"]; // Add more subreddits as needed

// Search for keywords in each subreddit
async function searchSubreddits() {
  for (const subredditName of SUBREDDITS) {
    const subreddit = await r.getSubreddit(subredditName);
    const submissions = await subreddit.getNew({ limit: 10 });
    submissions.forEach(processSubmission);
    console.log("SUBREDDITS:::", submissions);
  }
}

// Process each submission and send message if keywords are found
async function processSubmission(submission) {
  const title = submission.title.toLowerCase();
  if (KEYWORDS.some((keyword) => title.includes(keyword))) {
    await sendMessage(submission.author);
  }
}

// Send message to the author of the post
async function sendMessage(author) {
  try {
    await r.composeMessage({
      to: author.name,
      subject: "Regarding your post",
      text: "Hello, I noticed that your post matches our hiring criteria. Please check our website for more information.",
    });
    console.log("Message sent to", author.name);
  } catch (error) {
    console.error("An error occurred while sending message to", author.name);
    console.error(error);
  }
}

// Run the bot
async function runBot() {
  while (true) {
    await searchSubreddits();
    await new Promise((resolve) => setTimeout(resolve, 60000)); // Check every minute, you can adjust as needed
  }
}

// Start the bot
runBot();
