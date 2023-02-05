const jiraIssueHeader = document.querySelector("#jira-issue-header");
const actionsContainer = jiraIssueHeader.firstChild.firstChild.firstChild;
const ticketId = document.querySelector(
  'a[data-testid="issue.views.issue-base.foundation.breadcrumbs.current-issue.item"] > span'
).textContent;

actionsContainer.style.flexGrow = "2";

const copyTicketButton = document.createElement("button");
copyTicketButton.textContent = ticketId;

actionsContainer.insertAdjacentElement("afterEnd", copyTicketButton);

copyTicketButton.addEventListener("click", function () {
  console.log("Adding");

  navigator.clipboard.writeText(copyTicketButton.textContent).then(
    function () {
      console.log("Copying to clipboard was successful!");
    },
    function (err) {
      console.error("Could not copy text: ", err);
    }
  );
});

const attachButton = document.querySelector('button[aria-label="Attach"]');

// 👇️ Get computed styles of original element
const attachButtonStyles = window.getComputedStyle(attachButton);

let cssText = attachButtonStyles.cssText;

if (!cssText) {
  cssText = Array.from(attachButtonStyles).reduce((str, property) => {
    return `${str}${property}:${attachButtonStyles.getPropertyValue(
      property
    )};`;
  }, "");
}

// 👇️ Assign CSS styles to the element
copyTicketButton.style.cssText = cssText;

copyTicketButton.style.width = "auto";
