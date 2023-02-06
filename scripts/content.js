const CLIPBOARD_ICON = "&#128203";
const CHECKMARK_ICON = "&#10004;";

function createCopyButton(
  { buttonText, copyText, width },
  existingButtonCssText
) {
  const newButton = document.createElement("button");
  const textWithClipboard = `${CLIPBOARD_ICON} ${buttonText}`;

  newButton.innerHTML = textWithClipboard;
  newButton.dataset.copyText = copyText;
  newButton.title = `Copy: ${copyText}`;
  // assign existing button styles to new copy button
  newButton.style.cssText = existingButtonCssText;
  // explicitly set button width to accommodate different icon widths
  newButton.style.width = width || "auto";

  // temporarily show success icon after successful copy click
  newButton.addEventListener("click", async function () {
    try {
      await navigator.clipboard.writeText(copyText);

      newButton.innerHTML = `${CHECKMARK_ICON} ${buttonText}`;

      setTimeout(() => {
        newButton.innerHTML = textWithClipboard;
      }, 1500);
    } catch (error) {
      console.error("Could not copy text: ", error);
    }
  });

  return newButton;
}

function getCssText(element) {
  const styles = window.getComputedStyle(element);
  let cssText = styles.cssText;

  if (!cssText) {
    cssText = Array.from(styles).reduce((str, property) => {
      return `${str}${property}:${styles.getPropertyValue(property)};`;
    }, "");
  }

  return cssText;
}

function addCopyButtons(issueHeader, issueIdSpan) {
  if (!issueHeader || !issueIdSpan) {
    return;
  }

  // get the issue ID and Title
  const issueIdText = issueIdSpan.textContent;
  const issueTitleText = document.querySelector(
    'h1[data-test-id="issue.views.issue-base.foundation.summary.heading"]'
  ).textContent;

  // copy existing button styles to use for new buttons
  const attachButton = document.querySelector('button[aria-label="Attach"]');
  const existingButtonCssText = getCssText(attachButton);

  // create and insert container for our new copy buttons
  const newButtonsContainer = document.createElement("div");
  newButtonsContainer.style.display = "flex";
  newButtonsContainer.style.columnGap = "8px";
  newButtonsContainer.setAttribute("id", "copyButtons");

  const actionsContainer = issueHeader.firstChild.firstChild.firstChild;
  actionsContainer.insertAdjacentElement("afterEnd", newButtonsContainer);
  actionsContainer.style.flexGrow = "2";

  // create and add copy buttons
  const newButtonsProperties = [
    {
      buttonText: "ID",
      copyText: issueIdText,
      width: "52px",
    },
    {
      buttonText: "Title",
      copyText: issueTitleText,
      width: "67px",
    },
    {
      buttonText: "Title (ID)",
      copyText: `${issueTitleText} (${issueIdText})`,
      width: "97px",
    },
  ];

  newButtonsProperties.forEach((buttonProperties) => {
    const newButton = createCopyButton(buttonProperties, existingButtonCssText);

    newButtonsContainer.appendChild(newButton);
  });
}

// issues may not be present when page loads and can be viewed dynamically (ex: in modals opened by user)
// watch for DOM changes so we know when to attempt to add copy buttons
const observer = new MutationObserver((_mutationList) => {
  const issueHeader = document.getElementById("jira-issue-header");
  const issueIdSpan = document.querySelector(
    'a[data-testid="issue.views.issue-base.foundation.breadcrumbs.current-issue.item"] > span'
  );

  const areRequiredElementsPresent = issueHeader && issueIdSpan;
  const areCopyButtonsPresent = document.getElementById("copyButtons");

  if (!areCopyButtonsPresent && areRequiredElementsPresent) {
    addCopyButtons(issueHeader, issueIdSpan);
  }
});

observer.observe(document.body, { childList: true, subtree: true });
