from flask import Flask, render_template, request, redirect, url_for
import sqlite3

app = Flask(__name__)

DATABASE = "attendance.db"


# -----------------------------
# DATABASE
# -----------------------------
def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


def create_table():
    conn = get_db()

    conn.execute("""
    CREATE TABLE IF NOT EXISTS attendance(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        coursecode TEXT,
        coursedesc TEXT,
        ltps TEXT,
        year TEXT,
        semester TEXT,
        conducted INTEGER,
        attended INTEGER,
        absent INTEGER,
        tcbr INTEGER
    )
    """)

    conn.commit()
    conn.close()


# -----------------------------
# HOME
# -----------------------------
@app.route("/")
def index():

    conn = get_db()

    data = conn.execute(
        "SELECT * FROM attendance ORDER BY id"
    ).fetchall()

    rows = []

    for row in data:

        conducted = row["conducted"]
        attended = row["attended"]

        if conducted == 0:
            percentage = 0
        else:
            percentage = round((attended / conducted) * 100)

        # -----------------------------
        # Attendance Status
        # -----------------------------

        if percentage < 65:
            status = "critical"

        elif percentage < 75:
            status = "medical"

        elif percentage < 85:
            status = "fine"

        else:
            status = "safe"

        # -----------------------------
        # Attend Needed (Target = 85%)
        # -----------------------------

        need_to_attend = 0

        temp_conducted = conducted
        temp_attended = attended

        while temp_conducted > 0 and (temp_attended / temp_conducted) * 100 < 85:

            temp_conducted += 1
            temp_attended += 1
            need_to_attend += 1


        # -----------------------------
        # Can Skip (Stay >= 85%)
        # -----------------------------

        can_skip = 0

        temp_conducted = conducted

        while temp_conducted > 0 and (attended / (temp_conducted + 1)) * 100 >= 85:

            temp_conducted += 1
            can_skip += 1

        rows.append({
            "id": row["id"],
            "coursecode": row["coursecode"],
            "coursedesc": row["coursedesc"],
            "ltps": row["ltps"],
            "year": row["year"],
            "semester": row["semester"],
            "conducted": conducted,
            "attended": attended,
            "absent": row["absent"],
            "tcbr": row["tcbr"],
            "percentage": percentage,
            "status": status,
            "need_to_attend": need_to_attend,
            "can_skip": can_skip
        })

    conn.close()

    return render_template("index.html", rows=rows)


# -----------------------------
# ADD SUBJECT
# -----------------------------
@app.route("/add", methods=["GET", "POST"])
def add():

    if request.method == "POST":

        coursecode = request.form["coursecode"]
        coursedesc = request.form["coursedesc"]
        ltps = request.form["ltps"]
        year = request.form["year"]
        semester = request.form["semester"]

        conducted = int(request.form["conducted"])
        attended = int(request.form["attended"])

        absent = conducted - attended

        tcbr = int(request.form["tcbr"])

        conn = get_db()

        conn.execute("""
        INSERT INTO attendance(
        coursecode,
        coursedesc,
        ltps,
        year,
        semester,
        conducted,
        attended,
        absent,
        tcbr
        )
        VALUES(?,?,?,?,?,?,?,?,?)
        """,
        (
            coursecode,
            coursedesc,
            ltps,
            year,
            semester,
            conducted,
            attended,
            absent,
            tcbr
        ))

        conn.commit()
        conn.close()

        return redirect(url_for("index"))

    return render_template("add.html")


# -----------------------------
# UPDATE
# -----------------------------
@app.route("/update/<int:id>", methods=["GET", "POST"])
def update(id):

    conn = get_db()

    row = conn.execute(
        "SELECT * FROM attendance WHERE id=?",
        (id,)
    ).fetchone()

    if request.method == "POST":

        coursecode = request.form["coursecode"]
        coursedesc = request.form["coursedesc"]
        ltps = request.form["ltps"]
        year = request.form["year"]
        semester = request.form["semester"]

        conducted = int(request.form["conducted"])
        attended = int(request.form["attended"])

        absent = conducted - attended

        tcbr = int(request.form["tcbr"])

        conn.execute("""
        UPDATE attendance SET
        coursecode=?,
        coursedesc=?,
        ltps=?,
        year=?,
        semester=?,
        conducted=?,
        attended=?,
        absent=?,
        tcbr=?
        WHERE id=?
        """,
        (
            coursecode,
            coursedesc,
            ltps,
            year,
            semester,
            conducted,
            attended,
            absent,
            tcbr,
            id
        ))

        conn.commit()
        conn.close()

        return redirect(url_for("index"))

    conn.close()

    return render_template("edit.html", row=row)


# -----------------------------
# DELETE
# -----------------------------
@app.route("/delete/<int:id>")
def delete(id):

    conn = get_db()

    conn.execute(
        "DELETE FROM attendance WHERE id=?",
        (id,)
    )

    conn.commit()
    conn.close()

    return redirect(url_for("index"))


# -----------------------------
# RUN
# -----------------------------
if __name__ == "__main__":

    create_table()

    app.run(
        debug=True
    )