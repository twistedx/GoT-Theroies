$(document).ready(function() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      uid = user.uid;
      userName = user.displayName;
      getAuthors(userName, uid);
      checkUserExists(uid, userName);
    } else {
      //no user signed in
      uid = null;
      window.location.replace("index.html");
    }
  });

  function updatePost(post) {
    $.ajax({
      method: "PUT",
      url: "/api/posts",
      data: post
    }).then(function(event) {
      window.location.href = "/theory";
    });
  }

  function updateComment(post) {
    if (url.indexOf("?comment_id=") !== -1) {
      commentId = url.split("=")[1];
      post.id = commentId;
      console.log("Post in the update comment is" + post);
      $.ajax({
        method: "PUT",
        url: "/api/comment",
        data: post
      }).then(function(event) {
        window.location.href = "/theory";
      });
    }
  }
  // Getting jQuery references to the post body, title, form, and author select
  var bodyInput = $("#body");
  var titleInput = $("#title");
  var cmsForm = $("#cms");
  // Adding an event listener for when the form is submitted
  $(cmsForm).on("submit", handleFormSubmit);
  // Gets the part of the url that comes after the "?" (which we have if we're updating a post)
  var url = window.location.search;
  var postId;
  var commentId;
  var authorId;
  // Sets a flag for whether or not we're updating a post to be false initially
  var updatePostBool = false;
  var updateCommentBool = false;
  // If we have this section in our url, we pull out the post id from the url
  // In '?post_id=1', postId is 1
  if (url.indexOf("?post_id=") !== -1) {
    postId = url.split("=")[1];
    getPostData(postId, "post");
  } else if (url.indexOf("?comment_id=") !== -1) {
    commentId = url.split("=")[1];
    getPostData(commentId, "comment");
  }

  // Otherwise if we have an author_id in our url, preset the author select box to be our Author
  var checkUserExists = function(uid, userName) {
    $.get("/api/authors/" + uid, function(e) {
      authorId = e.id;
      $("#author").text(userName);
    });
  };
  // Getting the authors, and their posts

  // A function for handling what happens when the form to create a new post is submitted
  function handleFormSubmit(event) {
    event.preventDefault();
    // Wont submit the post if we are missing a body, title, or author
    if (!titleInput.val().trim() || !bodyInput.val().trim()) {
      return;
    }

    // Constructing a newPost object to hand to the database
    var newPost = {
      title: titleInput.val().trim(),
      body: bodyInput.val().trim(),
      AuthorId: authorId,
      id: postId
    };
    console.log(newPost);
    // If we're updating a post run updatePost to update a post
    // Otherwise run submitPost to create a whole new post
    if (updatePostBool) {
      console.log("Update post is" + updatePostBool);
      newPost.id = postId;
      updatePost(newPost);
    } else if (updateCommentBool) {
      console.log("Update Comment is " + updateCommentBool);
      updateComment(newPost);
    } else {
      submitPost(newPost);
    }
  }

  // Submits a new post and brings user to blog page upon completion
  function submitPost(post) {
    $.post("/api/posts", post, function() {
      window.location.href = "/theory";
    });
  }

  // Gets post data for the current post if we're editing, or if we're adding to an author's existing posts
  function getPostData(id, type) {
    var queryUrl;
    switch (type) {
      case "post":
        queryUrl = "/api/posts/" + id;
        console.log("i fired on post update");
        updatePostBool = true;
        break;
      case "comment":
        queryUrl = "/api/comment/" + id;
        console.log("i fired on comment update");
        updateCommentBool = true;
        break;
      default:
        return;
    }
    $.get(queryUrl, function(data) {
      if (data) {
        console.log(data.AuthorId || data.id);
        console.log(data);
        // If this post exists, prefill our cms forms with its data
        titleInput.val(data.title);
        bodyInput.val(data.body);
        authorId = data.AuthorId || data.id;
        if (queryUrl === "/api/comment/") {
          postId = data.PostId;
        }
        // If we have a post with this id, set a flag for us to know to update the post
        // when we hit submit
      }
    });
  }

  // A function to get Authors and then render our list of Authors
  function getAuthors(userName) {
    $("#author").html("<option>" + userName + "</option>");
  }

  // Update a given post, bring user to the blog page when done
});
