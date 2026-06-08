from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

FHIR_URL = "https://hapi.fhir.org/baseR4"


@app.get("/patients")
def get_patients():
    return requests.get(
        f"{FHIR_URL}/Patient?_count=10"
    ).json()


@app.get("/patient/{patient_id}")
def get_patient(patient_id: str):
    return requests.get(
        f"{FHIR_URL}/Patient/{patient_id}"
    ).json()


@app.get("/patient/{patient_id}/conditions")
def get_conditions(patient_id: str):
    return requests.get(
        f"{FHIR_URL}/Condition?patient={patient_id}"
    ).json()


@app.get("/patient/{patient_id}/medications")
def get_medications(patient_id: str):
    return requests.get(
        f"{FHIR_URL}/MedicationRequest?patient={patient_id}"
    ).json()


@app.get("/patient/{patient_id}/observations")
def get_observations(patient_id: str):
    return requests.get(
        f"{FHIR_URL}/Observation?patient={patient_id}&_count=20"
    ).json()


@app.get("/patient/{patient_id}/allergies")
def get_allergies(patient_id: str):
    return requests.get(
        f"{FHIR_URL}/AllergyIntolerance?patient={patient_id}"
    ).json()


@app.get("/patient/{patient_id}/encounters")
def get_encounters(patient_id: str):
    return requests.get(
        f"{FHIR_URL}/Encounter?patient={patient_id}"
    ).json()


@app.get("/patient/{patient_id}/immunizations")
def get_immunizations(patient_id: str):
    return requests.get(
        f"{FHIR_URL}/Immunization?patient={patient_id}"
    ).json()


@app.get("/patient/{patient_id}/procedures")
def get_procedures(patient_id: str):
    return requests.get(
        f"{FHIR_URL}/Procedure?patient={patient_id}"
    ).json()


@app.get("/patient/{patient_id}/careplans")
def get_careplans(patient_id: str):
    return requests.get(
        f"{FHIR_URL}/CarePlan?patient={patient_id}"
    ).json()


@app.get("/patient/{patient_id}/reports")
def get_reports(patient_id: str):
    return requests.get(
        f"{FHIR_URL}/DiagnosticReport?patient={patient_id}"
    ).json()