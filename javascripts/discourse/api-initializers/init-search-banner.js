import { apiInitializer } from "discourse/lib/api";
import SearchBanner from "../components/search-banner";
import axios from "axios";

export default apiInitializer("1.14.0", (api) => {
  api.renderInOutlet(
    settings.plugin_outlet === "above-main-container"
      ? "above-main-container"
      : "below-site-header",
    SearchBanner
  );

  api.forceDropdownForMenuPanels("search-menu-panel");
});

//Get user input for the asin variable
document.getElementById('searchForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the form from submitting

  const asin = document.getElementById('asinInput').value;
  
// ASIN Data API call
// set up the request parameters

const params = {
  api_key: "9FFE2360143A41CE980579367CE2131C",
  type: "reviews",
  amazon_domain: "amazon.com",
  asin: asin,
  sort_by: "most_recent",
  associate_id: "mymy011-20",
  review_formats: "all_formats",
  language: "en_US",
  global_reviews: "false",
  output: "json",
  include_html: "false"
}

// make the http GET request to ASIN Data API
  axios.get('https://api.asindataapi.com/request', { params })
  .then(response => {

      // Feed the JSON response to OpenRouter API
      const openRouterAccessToken = ENV["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"];
      const openRouterSiteName = "YOUR_APP_NAME";
      const openRouterSiteUrl = "YOUR_SITE_URL";

      const openRouterClient = new OpenRouter.Client({
        accessToken: openRouterAccessToken,
        siteName: openRouterSiteName,
        siteUrl: openRouterSiteUrl
      });

      const openRouterResponse = openRouterClient.complete({
        model: "perplexity/llama-3-sonar-small-32k-online",
        messages: [
          { role: "user", content: JSON.stringify(response.data) },
          { role: "assistant", content: "You will receive JSON results from ASIN Data API containing Amazon product names and reviews. I need you to summarize the review into a comprehensive review following below format: (1) Product Name: (2) Breakdown of Ratings: (3) ASIN: (4) Product Link: (Make it a working URL) (5) Product Reviews: - Pros - Cons (6) Critical Reviews List: - List 3 positive reviews with the keyword 'quality' - List 3 negative reviews with the keyword 'quality'"}
                ]
      });

      openRouterResponse.then(response => {
        console.log(response.choices[0].message.content);
      }).catch(error => {
        console.log(error);
      });

    }).catch(error => {
  // catch and print the error
  console.log(error);
  })
});

//Display result in a pop up page
const newWindow = window.open('', 'Response', 'width=400,height=300');

// Wait for the new window to load
newWindow.onload = () => {
  // Set the content of the new window to the response
  newWindow.document.write(`<h1>Response</h1><p>${response}</p>`);
};