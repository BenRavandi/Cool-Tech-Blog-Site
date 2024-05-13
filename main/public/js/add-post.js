async function newFormHandler(event) {
  event.preventDefault();

  const title = document.querySelector("#post-title").value;
  const content = document.querySelector("#post-text").value;

  const response = await fetch(`/api/posts`, {
    method: "POST",
    body: JSON.stringify({
      title,
      content,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    document.location.replace("/dashboard");
  } else {
    alert("Can Not Leave Blank... Title must be between 1-45 Char");
  }
}

document
  .querySelector("#add-post-form")
  .addEventListener("submit", newFormHandler);
