// ============================================
// Attendance Management System
// script.js
// ============================================


// Wait until page loads
document.addEventListener("DOMContentLoaded", function () {

    console.log("Attendance Management System Loaded");

    highlightLowAttendance();

    confirmDelete();

    calculateSummary();

});


// ============================================
// Highlight Low Attendance
// ============================================

function highlightLowAttendance() {

    const badges = document.querySelectorAll(".attendance");

    badges.forEach(function (badge) {

        let value = parseInt(
            badge.innerText.replace("%", "")
        );

        if (value < 75) {

            badge.title = "Low Attendance";

        }
        else if (value < 90) {

            badge.title = "Good Attendance";

        }
        else {

            badge.title = "Excellent Attendance";

        }

    });

}


// ============================================
// Delete Confirmation
// ============================================

function confirmDelete() {

    const buttons = document.querySelectorAll(".delete-btn");

    buttons.forEach(function (button) {

        button.addEventListener("click", function (event) {

            let result = confirm(
                "Are you sure you want to delete this subject?"
            );

            if (!result) {

                event.preventDefault();

            }

        });

    });

}


// ============================================
// Count Subjects
// ============================================

function calculateSummary() {

    const rows = document.querySelectorAll("tbody tr");

    console.log("Total Subjects :", rows.length);

}


// ============================================
// Auto Calculate Absent
// (Used on Add/Edit page)
// ============================================

const conductedInput = document.querySelector(
    'input[name="conducted"]'
);

const attendedInput = document.querySelector(
    'input[name="attended"]'
);

if (conductedInput && attendedInput) {

    function validateAttendance() {

        let conducted = parseInt(conductedInput.value) || 0;

        let attended = parseInt(attendedInput.value) || 0;

        if (attended > conducted) {

            alert("Attended classes cannot be greater than Conducted classes.");

            attendedInput.value = conducted;

        }

    }

    conductedInput.addEventListener(
        "input",
        validateAttendance
    );

    attendedInput.addEventListener(
        "input",
        validateAttendance
    );

}


// ============================================
// Hover Effect Logging
// ============================================

const registerButtons = document.querySelectorAll(".register-btn");

registerButtons.forEach(function (button) {

    button.addEventListener("mouseenter", function () {

        console.log("Viewing Attendance Register");

    });

});


// ============================================
// End
// ============================================

console.log("Script Loaded Successfully");