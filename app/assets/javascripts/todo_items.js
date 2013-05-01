// this should be attached to a button (or other element)
//   inside of an li element holding a 'todo item'
function deleteItem() {
  var todoLi = $(this).parent('li');
  var idToDelete = todoLi.attr('data-id');
  $.ajax({
    url: "/todo_items/" + idToDelete,
    method: "put",
    data: {
      "todo_item": {
        "deleted": true
      }
    },
    dataType: "json",
    success: function (deleted_item) {
      todoLi.remove();
      // if (todoLi.parent('ol').children('li').length === 0) {
      //   $('<li>Nothing to do!</li>').appendTo('#todo ol');
      // }
    },
    error: function () {
      alert("Sorry, we couldn't delete your todo.");
    }
  });
}

// this should be attached to a checkbox
//   inside of an li element holding a 'todo item'
function completeItem() {
  var todoLi = $(this).parent('li');
  var idToComplete = todoLi.attr('data-id');
  // console.log(todoLi.attr('data-id'));
  $.ajax({
    url: "/todo_items/" + idToComplete,
    method: "put",
    data: {
      "todo_item": {
        "completed": true
      }
    },
    dataType: "json",
    success: function (completed_item) {
      var completedContainer = $('#completed ol');
      var todoLiCopy = todoLi.clone(true, true); // deep copy with data and events
      todoLi.hide();
      todoLiCopy.children('input[type=checkbox]').prop("checked", true);
      todoLiCopy.appendTo(completedContainer);
      // todoLiCopy.off("click");
      // todoLiCopy.on("click", unCompleteItem);
    },
    error: function () {
      alert("Sorry, we couldn't complete your todo. " +
        "Looks like you'll have to do it again!");
    }
  });
}


// this should be attached to a checkbox
//   inside of an li element holding a 'todo item'
function unCompleteItem() {
  var todoLi = $(this).parent('li');
  var idToUnComplete = todoLi.attr('data-id');
  $.ajax({
    url: "/todo_items/" + idToUnComplete,
    method: "put",
    data: {
      "todo_item": {
        "completed": false
      }
    },
    dataType: "json",
    success: function (todo_item) {
      var todoContainer = $('#todo ol');
      var todoLiCopy = todoLi.clone(true, true); // deep copy with data and events
      todoLi.hide();
      todoLiCopy.children('input[type=checkbox]').prop("checked", false);
      todoLiCopy.appendTo(todoContainer);
      todoLiCopy.off("click");
      todoLiCopy.on("click", completeItem);
    },
    error: function () {
      alert("Sorry, we couldn't put your todo back in the queue. " +
        "Looks like it'll just stay completed!");
    }
  });
}



$(document).ready(function() {
  $('#new_todo_item').on('submit', function (event) {
    event.preventDefault();
    // { todo_item: { name: "Milk the cow"} }
    var name = $('#todo_item_name').val();
    var completed = false;
    var deleted = false;
    var form = $(this);

    $.ajax({
      url: form.attr('action'),
      method: form.attr('method'),
      data: {
        "todo_item": {
          "name": name,
          "completed": completed,
          "deleted": deleted,
          "due_at": new Date()
        }
      },
      dataType: "json",
      success: function (todo_item) { // todo_item is the response
        var todoContainer = $('#todo ol');
        var theCheckbox = $('<input type="checkbox">');
        var theText = $('<span>' + todo_item.name + '</span>');
        var deleteButton = $('<button>Delete</button>');
        var todoLi = $('<li data-id="' + todo_item.id + '"></li>');

        theCheckbox.appendTo(todoLi);
        theText.appendTo(todoLi);
        deleteButton.appendTo(todoLi);

        deleteButton.on('click', deleteItem);
        theCheckbox.on('click', completeItem);
        
        // if (todoContainer.children('li').length === 1 && todoContainer.children('li:first-child').text() === "Nothing to do!") {
        //   todoContainer.children('li:first-child').remove();
        // }

        todoLi.appendTo(todoContainer);
      },
      error: function () {
        alert("Sorry, we couldn't save your todo.");
      }
    });
  });

  $("#todo li button, #completed li button").on("click", deleteItem);
  $("#todo li input[type=checkbox]").on("click", completeItem);
  // $("#completed li input[type=checkbox]").on("click", unCompleteItem);

});