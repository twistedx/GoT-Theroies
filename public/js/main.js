var mainApp = {};

$(document).ready(function () {
  /* global moment */

  var firebase = app_firebase;
  var uid = null;
  var userName = "";

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      uid = user.uid;
      userName = user.displayName;
      checkUserExists(userName, uid);
    } else {
      //no user signed in
      uid = null;
      window.location.replace("index.html");
    }
  });

  function logOut() {
    firebase.auth().signOut();
  }
  mainApp.logOut = logOut;
  $("#signOut").on("click", mainApp.logOut);

  var checkUserExists = function (userName, uid) {
    $.get("/api/authors/" + uid, function (e) {
      if (e !== null) {
      } else {
        createAuthor(userName, uid);
      }
    });
  };

  var createAuthor = function (userName, uid) {
    var newAuthor = {
      author_name: userName,
      uid: uid
    };
    console.log(newAuthor);
    // console.log(newBurger);
    // Send the POST request.
    $.ajax("/api/authors", {
      method: "POST",
      data: newAuthor
    }).then(function () {
      console.log("Added new authors");
    });
  };

  // Our CMS Functions

  $(".edit").on("click", function (event) {
    handlePostEdit(event.target.value);
  });

  $(".delete").on("click", function (event) {
    var temp = event.target.value;
    handlePostDelete(temp);
  });
  $(".editComment").on("click", function (event) {
    handleCommentEdit(event.target.value);
  });
  $(".comment").on("click", function (event) {
    var temp = event.target.value;
    window.location.href = "/comment/" + temp;
  });

  $(".deleteComment").on("click", function (event) {
    var temp = event.target.value;
    handleDeleteEvent(temp);
  });


  $("#like").on("click", function (event) {
    event.preventDefault();
    var id = event.target.value;

    var uLike = {
      likes: 1,
      dislikes: 0,
      hasVoted: true,
      PostId: id
    };

    // Send the PUT request.
    $.ajax("/api/votes", {
      method: "POST",
      data: uLike
    }).then(
      function (event) {
        console.log(event);
        // Reload the page to get the updated list
        location.reload();
        
      });
  });

  $("#dislike").on("click", function (event) {
    event.preventDefault();
    var id = event.target.value;

    var uLike = {
      likes: 1,
      dislikes: 0,
      hasVoted: true,
      PostId: id
    };

    // Send the PUT request.
    $.ajax("/api/votes", {
      method: "POST",
      data: uLike
    }).then(
      function (event) {
        console.log(event);
        // Reload the page to get the updated list
        location.reload();
      });
  });

  // This function does an API call to delete posts
  function deletePost(id) {
    $.ajax({
      method: "DELETE",
      url: "/api/posts/" + id
    }).then(function () {
      window.location.href = "/theory";
    });
  }
  function deleteCommentNow(id) {
    $.ajax({
      method: "DELETE",
      url: "/api/comment/" + id
    }).then(function () {
      window.location.href = "/theory";
    });
  }
  // This function figures out which post we want to delete and then calls deletePost
  function handlePostDelete(id) {
    deletePost(id);
  }
  function handleDeleteEvent(id) {
    deleteCommentNow(id);
  }

  // This function figures out which post we want to edit and takes it to the appropriate url
  function handlePostEdit(id) {
    window.location.href = "/cms?post_id=" + id;
  }

  function handleCommentEdit(id) {
    window.location.href = "/cms?comment_id=" + id;
  }
});
