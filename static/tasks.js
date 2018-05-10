var RESTAPI = "http://127.0.0.1:5000/api/v1.0";

function load_task_list(father_div) {

    father_div.html("<u1 id='list' class='list-group'></u1>");

    $.getJSON(RESTAPI + "/tasks", function (data) {
        let tasks = data["tasks"]; // the dictionary from JSON
        for (let index in tasks) {
            let t = tasks[index];
            let buttons = "<span class='pull-right'>";
            let dataset_upg = " data-id=" + t.id + " data-desc=\""+t.description+"\" data-urg="+t.urgent + " ";
            let del = "<button class='btn btn-danger delete' role='button' data-id=" + t.id + " >Delete</button></span>";
            let upg = "<button class='btn btn-success update' role='button' " + dataset_upg + ">Update</button>";
            buttons +=  upg + del ;
            if (tasks[index].urgent == 1)
                $("#list").append($("<li class='list-group-item clearfix active'><strong>" + tasks[index].description + "</strong>" + buttons +"</li>"));
            else
                $("#list").append($("<li class='list-group-item clearfix' >" + tasks[index].description + buttons +"</li>"));
        }
        $(".btn.btn-danger.delete").click(function () {
                deleteTask(this.dataset.id);
        });
        $(".btn.btn-success.update").click(function () {
                updateTask(this.dataset.id,this.dataset.desc,this.dataset.urgent);
        });
    });
}

var submit_put = function () {
        let json = JSON.stringify(task);

        $.ajax({
            type: 'PUT',
            url: RESTAPI + '/tasks/' + id,
            contentType: "application/json",
            data: json,
            success: function () {
                load_task_list($("#tasklist"));
                reset_prev(orig_desc, orig_urg);
            }
        });
};

var submit_post = function(){
        let description = $("#taskDescription").val() ;
        let urgent = $("#taskUrgent").is(":checked") ;
        let task = { "description": description, "urgent": urgent ? 1 : 0 } ;
        let json =  JSON.stringify(task) ;

        $.post({
            "url": RESTAPI+'/tasks',
            "data": json,
            "contentType": "application/json",
            "success": function(){load_task_list($("#tasklist"))}
        }) ;
        return false;
};

$(document).ready(function () {
    //$("#addForm").on("submit",submit_post);
    $("#addForm").submit(submit_post);

    load_task_list($("#tasklist"));
});

function updateTask(id,desc,urg) {
    let task = {"description": desc, "urgent": urg ? 1 : 0, "id": id};
    let orig_desc = $("#taskDescription").val();
    let orig_urg = $("#taskUrgent").is(":checked");

    $("#taskDescription").val(desc);
    if (urg)
        $("#taskUrgent").prop('checked', true);
    else
        $("#taskUrgent").prop('checked', false);
    $("#addTask").html("Update");

    //$("#addForm").off("submit", submit_post).on("submit",submit_put)


    $("#addForm").off("submit");
    $("#addForm").on("submit", function () {
        let json = JSON.stringify(task);

        $.ajax({
            type: 'PUT',
            url: RESTAPI + '/tasks/' + id,
            contentType: "application/json",
            data: json,
            success: function () {
                load_task_list($("#tasklist"));
                reset_prev(orig_desc, orig_urg);
            }
        });
    });

}

function reset_prev(orig_desc,orig_urg) {
    $("#taskDescription").val(orig_desc);
    if (orig_urg)
        $("#taskUrgent").prop('checked', true);
    else
        $("#taskUrgent").prop('checked', false);
    $("#addTask").html("Add");

    $("#addForm").off("submit");
    $("#addForm").on(submit_post);
}

function deleteTask(id){
    $.ajax({
        url: RESTAPI + '/tasks/' + id,
        type: 'DELETE',
        success: function(){load_task_list($("#tasklist"))}
    });
}