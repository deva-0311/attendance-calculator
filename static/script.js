// ========================================
// Attendance Calculator V2
// ========================================

// All Subjects
let attendanceData = [];

// Editing Index
let editIndex = -1;


// ========================================
// Load Data
// ========================================

function loadData() {

    const saved = localStorage.getItem("attendanceData");

    if (saved) {

        attendanceData = JSON.parse(saved);

    }

}


// ========================================
// Save Data
// ========================================

function saveData() {

    localStorage.setItem(
        "attendanceData",
        JSON.stringify(attendanceData)
    );

}


// ========================================
// Popup
// ========================================

const popup = document.getElementById("popupOverlay");

const addButton = document.getElementById("addSubjectBtn");

const cancelButton = document.getElementById("cancelBtn");

const saveButton = document.getElementById("saveBtn");


// Open Popup
addButton.addEventListener("click", () => {

    document.getElementById("popupTitle").textContent = "Add Subject";

    editIndex = -1;

    popup.style.display = "flex";

});


// Close Popup
cancelButton.addEventListener("click", () => {

    popup.style.display = "none";

});


// Close Outside Popup
popup.addEventListener("click", (event) => {

    if (event.target === popup) {

        popup.style.display = "none";

    }

});


// ========================================
// Start
// ========================================

loadData();
renderTable();
// ========================================
// Save Subject
// ========================================

saveButton.addEventListener("click", function () {

    console.log("Save button clicked");

    const subject = {

        coursecode: document.getElementById("courseCode").value,

        coursedesc: document.getElementById("courseName").value,

        ltps: document.getElementById("ltps").value,

        year: document.getElementById("year").value,

        semester: document.getElementById("semester").value,

        conducted: parseInt(document.getElementById("conducted").value) || 0,

        attended: parseInt(document.getElementById("attended").value) || 0,

        tcbr: parseInt(document.getElementById("tcbr").value) || 0

    };

    console.log(subject);

    if(editIndex == -1){

        attendanceData.push(subject);

    }
    else{

        attendanceData[editIndex] = subject;

        editIndex = -1;

    }

    saveData();

    console.log(attendanceData);

    renderTable();

    popup.style.display = "none";

    document.getElementById("courseCode").value = "";
    document.getElementById("courseName").value = "";
    document.getElementById("ltps").value = "";
    document.getElementById("year").value = "";
    document.getElementById("semester").value = "";
    document.getElementById("conducted").value = "";
    document.getElementById("attended").value = "";
    document.getElementById("tcbr").value = "";

});
console.log("Script Loaded");

// ========================================
// Render Table
// ========================================

function renderTable() {

    const tbody = document.getElementById("attendanceBody");

    tbody.innerHTML = "";

    attendanceData.forEach((subject, index) => {

        const absent = subject.conducted - subject.attended;

        let percentage = 0;

        if (subject.conducted > 0) {

            percentage = Math.round(
                (subject.attended / subject.conducted) * 100
            );

        }

        // ========================================
        // Attendance Status
        // ========================================

        let status = "";

        if (percentage < 65) {

            status = "⛔";

        }
        else if (percentage < 75) {

            status = "🏥";

        }
        else if (percentage < 85) {

            status = "💰";

        }
        else {

            status = "✅";

        }

        // ========================================
        // Attend Needed (Target = 85%)
        // ========================================

        let needToAttend = 0;

        let tempConducted = subject.conducted;

        let tempAttended = subject.attended;

        while (
            tempConducted > 0 &&
            (tempAttended / tempConducted) * 100 < 85
        ) {

            tempConducted++;
            tempAttended++;
            needToAttend++;

        }

        // ========================================
        // Can Skip (Stay >= 85%)
        // ========================================

        let canSkip = 0;

        let tempConducted2 = subject.conducted;

        while (
            tempConducted2 > 0 &&
            (subject.attended / (tempConducted2 + 1)) * 100 >= 85
        ) {

            tempConducted2++;
            canSkip++;

        }

        tbody.innerHTML += `
        <tr>

            <td>${index + 1}</td>

            <td>${subject.coursecode}</td>

            <td>${subject.coursedesc}</td>

            <td>${subject.ltps}</td>

            <td>${subject.year}</td>

            <td>${subject.semester}</td>

            <td>${subject.conducted}</td>

            <td>${subject.attended}</td>

            <td>${absent}</td>

            <td>${subject.tcbr}</td>

            <td style="font-size:22px">

${status}

</td>

            <td>

                <span class="
${
percentage >= 85
? 'green-badge'
: percentage >= 75
? 'blue-badge'
: 'red-badge'
}
">

${getPercentageBadge(percentage)}

</span>

            </td>

            <td>

${
needToAttend == 0
? "✅"
: "📚 " + needToAttend
}

            </td>

            <td>

${
canSkip == 0
? "❌"
: "🥳 " + canSkip
}

            </td>

            <td class="action-cell">

                <button
                    class="edit-btn"
                    onclick="editSubject(${index})">

                    Edit

                </button>

                <button
                    class="delete-btn"
                    onclick="deleteSubject(${index})">

                    Delete

                </button>

            </td>

        </tr>
        `;

    });

    document.getElementById("totalSubjects").textContent = attendanceData.length;

}

function getPercentageBadge(percentage) {

    if (percentage < 65) {

        return `<span class="percentage-badge danger-black">${percentage}%</span>`;

    }

    else if (percentage < 75) {

        return `<span class="percentage-badge danger-red">${percentage}%</span>`;

    }

    else if (percentage < 85) {

        return `<span class="percentage-badge warning-blue">${percentage}%</span>`;

    }

    else {

        return `<span class="percentage-badge success-green">${percentage}%</span>`;

    }

}

// ========================================
// Delete Subject
// ========================================

function deleteSubject(index){

    if(confirm("Delete this subject?")){

        attendanceData.splice(index,1);

        saveData();

        renderTable();

    }

}

// ========================================
// Edit Subject
// ========================================

function editSubject(index){

    editIndex = index;

    const subject = attendanceData[index];

    document.getElementById("courseCode").value = subject.coursecode;
    document.getElementById("courseName").value = subject.coursedesc;
    document.getElementById("ltps").value = subject.ltps;
    document.getElementById("year").value = subject.year;
    document.getElementById("semester").value = subject.semester;
    document.getElementById("conducted").value = subject.conducted;
    document.getElementById("attended").value = subject.attended;
    document.getElementById("tcbr").value = subject.tcbr;

    popup.style.display = "flex";

}
