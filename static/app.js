const API = "http://127.0.0.1:8000";


// ---------------- PATIENT LIST ----------------
async function loadPatients() {
    const res = await fetch(`${API}/patients`);
    const data = await res.json();

    const list = document.getElementById("patientList");
    list.innerHTML = "";

    if (!data.entry) {
        list.innerHTML = "No patients found";
        return;
    }

    data.entry.forEach(item => {
        const p = item.resource;

        const div = document.createElement("div");
        div.className = "patient";

        const name =
            `${p.name?.[0]?.family || "Unknown"}, ${p.name?.[0]?.given?.[0] || ""}`;

        div.innerHTML = `
            <strong>${name}</strong><br>
            <small>${p.id}</small>
        `;

        div.onclick = () => loadPatient(p.id);

        list.appendChild(div);
    });
}



// ---------------- PATIENT DETAILS ----------------
async function loadPatient(id) {

    // ---------------- PATIENT ----------------
    const patient =
        await fetch(`${API}/patient/${id}`).then(r => r.json());

    const address =
        patient.address?.[0]
            ? `${patient.address[0].line?.[0] || ""}
               ${patient.address[0].city || ""}
               ${patient.address[0].state || ""}
               ${patient.address[0].postalCode || ""}`
            : "N/A";

    document.getElementById("patientDetails").innerHTML = `
        <div class="row"><b>Name:</b>
            ${patient.name?.[0]?.family || ""},
            ${patient.name?.[0]?.given?.[0] || ""}
        </div>

        <div class="row"><b>Gender:</b>
            ${patient.gender || "N/A"}
        </div>

        <div class="row"><b>DOB:</b>
            ${patient.birthDate || "N/A"}
        </div>

        <div class="row"><b>Patient ID:</b>
            ${patient.id}
        </div>

        <div class="row"><b>Address:</b>
            ${address}
        </div>

        <div class="row">
            <b>Clinical Note:</b><br>
            ${patient.text?.div || "No narrative available"}
        </div>
    `;



    // ---------------- CONDITIONS ----------------
    const condData =
        await fetch(`${API}/patient/${id}/conditions`)
            .then(r => r.json());

    let condHTML = "";

    if (condData.entry?.length) {

        condData.entry.forEach(c => {

            const cond = c.resource;

            const text =
                cond.code?.text ||
                cond.code?.coding?.[0]?.display ||
                "Unknown Condition";

            const status =
                cond.clinicalStatus?.coding?.[0]?.code ||
                "unknown";

            const verification =
                cond.verificationStatus?.coding?.[0]?.code ||
                "unknown";

            const onset =
                cond.onsetDateTime || "Unknown";

            const note =
                cond.note?.[0]?.text || "";

            condHTML += `
                <div class="item">
                    <b>${text}</b><br>

                    Status:
                    <span class="badge active">
                        ${status}
                    </span>

                    <br>

                    Verification:
                    ${verification}

                    <br>

                    Onset:
                    ${onset}

                    ${note
                        ? `<br><i>${note}</i>`
                        : ""}
                </div>
            `;
        });

    } else {

        condHTML =
            "<div class='item'>No conditions found</div>";
    }

    document.getElementById("conditions").innerHTML =
        condHTML;



    // ---------------- MEDICATIONS ----------------
    const medData =
        await fetch(`${API}/patient/${id}/medications`)
            .then(r => r.json());

    let medHTML = "";

    if (medData.entry?.length) {

        medData.entry.forEach(m => {

            const med = m.resource;

            const text =
                med.medicationCodeableConcept?.text ||
                med.medicationCodeableConcept?.coding?.[0]?.display ||
                "Unknown Medication";

            const dosage =
                med.dosageInstruction?.[0]?.text ||
                "No dosage available";

            const authored =
                med.authoredOn || "Unknown";

            const status =
                med.status || "Unknown";

            medHTML += `
                <div class="item">
                    <b>${text}</b><br>

                    Status: ${status}<br>

                    Ordered:
                    ${authored}<br>

                    Dosage:
                    ${dosage}
                </div>
            `;
        });

    } else {

        medHTML =
            "<div class='item'>No medications found</div>";
    }

    document.getElementById("medications").innerHTML =
        medHTML;



    // ---------------- OBSERVATIONS / LABS ----------------
    const obsData =
        await fetch(`${API}/patient/${id}/observations`)
            .then(r => r.json());

    let obsHTML = "";

    if (obsData.entry?.length) {

        obsData.entry.forEach(o => {

            const obs = o.resource;

            const test =
                obs.code?.text ||
                obs.code?.coding?.[0]?.display ||
                "Unknown Test";

            const value =
                obs.valueQuantity?.value ??
                obs.valueString ??
                "N/A";

            const unit =
                obs.valueQuantity?.unit || "";

            const date =
                obs.effectiveDateTime || "";

            obsHTML += `
                <div class="item">
                    <b>${test}</b><br>

                    Result:
                    ${value} ${unit}

                    <br>

                    Date:
                    ${date}
                </div>
            `;
        });

    } else {

        obsHTML =
            "<div class='item'>No lab results found</div>";
    }

    document.getElementById("observations").innerHTML =
        obsHTML;
}



// ---------------- INIT ----------------
loadPatients();
