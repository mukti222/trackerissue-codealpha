
function submitIssue(e) {
  const getInputValue = (id) => document.getElementById(id).value;
  const description = getInputValue("issueDescription");
  const severity = getInputValue("issueSeverity");
  const assignedTo = getInputValue("issueAssignedTo");
  const role = getInputValue("issueRole"); // Tambahkan ini
  const id = Math.floor(Math.random() * 100000000) + "";
  const status = "Open";

  if (description.length == 0 || assignedTo.length == 0 || role.length == 0) {
    alert("Please fill all fields with required data.");
    document.getElementById("add-issue").setAttribute("data-toggle", "modal");
    document
      .getElementById("add-issue")
      .setAttribute("data-target", "#emptyField");
  } else {
    document
      .getElementById("add-issue")
      .removeAttribute("data-toggle", "modal");
    document
      .getElementById("add-issue")
      .removeAttribute("data-target", "#emptyField");
    const issue = { id, description, severity, assignedTo, role, status }; // Tambahkan role di sini
    let issues = [];
    if (localStorage.getItem("issues")) {
      issues = JSON.parse(localStorage.getItem("issues"));
    }
    issues.push(issue);
    localStorage.setItem("issues", JSON.stringify(issues));

    fetchIssues();
  }
}

const closeIssue = (id) => {
  const issues = JSON.parse(localStorage.getItem("issues"));
  const currentIssue = issues.find((issue) => issue.id == id);
  currentIssue.status = "Closed";
  currentIssue.description = `<strike>${currentIssue.description}</strike>`;
  localStorage.setItem("issues", JSON.stringify(issues));
  fetchIssues();
};

const deleteIssue = (id) => {
  const issues = JSON.parse(localStorage.getItem("issues"));
  const remainingIssues = issues.filter((issue) => issue.id != id);
  localStorage.removeItem("issues");
  localStorage.setItem("issues", JSON.stringify(remainingIssues));
  fetchIssues();
  location.reload();
  // updateDoughnutChart(JSON.parse(localStorage.getItem('issues')));
};
const fetchIssues = () => {
  const issues = JSON.parse(localStorage.getItem("issues"));
  const issuesList = document.getElementById("issuesList");
  issuesList.innerHTML = "";

  for (var i = 0; i < issues.length; i++) {
    const { id, description, severity, assignedTo, role, status } = issues[i];

    issuesList.innerHTML += `<div class="well">
    <h3> ${description} </h3>

                              
                              <p><span class="label label-info"> ${status} </span></p>
                              <h6>Issue ID: ${id} </h6>

                              <div class="modal-body">
  <div class="modal-item"><span class="glyphicon glyphicon-time"></span> ${severity}</div>
  <div class="modal-item"><span class="glyphicon glyphicon-user"></span> ${assignedTo} </div>
  <div class="modal-item"><span class="glyphicon glyphicon-briefcase"></span> ${role}</div>
</div>

                              <button onclick="showModal('${id}', '${description}', '${severity}', '${assignedTo}', '${role}')" class="btn btn-info">Details</button>
                              <button onclick="closeIssue(${id})" class="btn btn-warning">Close</button>
                              <button onclick="deleteIssue(${id})" class="btn btn-danger">Delete</button>
                              </div>`;
  }
  // updateDoughnutChart(JSON.parse(localStorage.getItem('issues')));
};

// Tambahkan fungsi showModal
const showModal = (id, description, severity, assignedTo, role) => {
  document.getElementById("modalDescription").innerText = description;
  document.getElementById("modalPriority").innerText = severity;
  document.getElementById("modalAssignedTo").innerText = assignedTo;
  document.getElementById("modalRole").innerText = role;

  $("#updateInProgressBtn")
    .off("click")
    .on("click", function () {
      updateToInProgress(id);
      $("#issueDetailsModal").modal("hide");
    });

  $("#issueDetailsModal").modal("show");
};

const updateToInProgress = (id) => {
  const issues = JSON.parse(localStorage.getItem("issues"));
  const currentIssue = issues.find((issue) => issue.id == id);
  currentIssue.status = "In Progress";
  localStorage.setItem("issues", JSON.stringify(issues));
  fetchIssues();
};

// Tambahkan fungsi untuk membuat dan mengupdate grafik doughnut
function createDoughnutChart(data) {
  var ctx = document.getElementById("doughnutChart").getContext("2d");
  var doughnutChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Low", "Medium", "High"],
      datasets: [
        {
          data: data,
          backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
        },
      ],
    },
    options: {
      responsive: true,
      legend: {
        display: true,
        position: "bottom",
      },
    },
  });
}

// Tambahkan fungsi untuk mengupdate grafik doughnut berdasarkan data issue
function updateDoughnutChart(issues) {
  var lowCount = 0;
  var mediumCount = 0;
  var highCount = 0;

  for (var i = 0; i < issues.length; i++) {
    var severity = issues[i].severity;
    if (severity === "Low") {
      lowCount++;
    } else if (severity === "Medium") {
      mediumCount++;
    } else if (severity === "High") {
      highCount++;
    }
  }

  var data = [lowCount, mediumCount, highCount];
  createDoughnutChart(data);
}

// Panggil fungsi untuk pertama kali saat halaman dimuat
updateDoughnutChart(JSON.parse(localStorage.getItem("issues")));

fetchIssues();
