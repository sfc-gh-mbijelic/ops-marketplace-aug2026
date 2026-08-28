"""
Generate synthetic Ontario Public Sector data for the OPS Data Marketplace demo.
Produces 9 CSV files in the data/ directory, 1000 rows each.
Deterministic seed for reproducibility.
"""
import csv
import os
import random
from datetime import datetime, timedelta

SEED = 42
random.seed(SEED)

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
os.makedirs(DATA_DIR, exist_ok=True)

# Ontario-specific reference data
REGIONS = ["GTA", "Ottawa", "Northern", "Eastern", "Southwestern", "Central", "Niagara", "Hamilton", "Durham", "Waterloo"]
PROGRAMS_MCCSS = ["Ontario Works", "ODSP", "Child Care Subsidy", "Home Care", "Employment Services", "Youth Services", "Family Support", "Community Living"]
SERVICE_CATEGORIES = ["Employment", "Child Care", "Home Care", "Disability", "Youth", "Family", "Community", "Housing"]
FISCAL_YEARS = ["FY2023-24", "FY2024-25", "FY2025-26"]
QUARTERS = ["2024-04-01", "2024-07-01", "2024-10-01", "2025-01-01", "2025-04-01", "2025-07-01", "2025-10-01", "2026-01-01"]
REFERRAL_SOURCES = ["Self-Referral", "Community Agency", "Hospital", "School", "Court", "Other Ministry", "Family Doctor", "Online Portal"]
COMPLEXITY = ["Simple", "Standard", "Complex"]
RISK_LEVELS = ["Low", "Medium", "High"]
TRIAGE_CATEGORIES = [1, 2, 3, 4, 5]
HOSPITALS = [f"Hospital_{i:03d}" for i in range(1, 51)]
SCHOOLS = [f"School_{i:03d}" for i in range(1, 101)]
ENERGY_STATIONS = [f"STN_{i:04d}" for i in range(1, 201)]
ROAD_SEGMENTS = [f"SEG_{i:05d}" for i in range(1, 501)]
BUSINESS_TYPES = ["Corporation", "Sole Proprietorship", "Partnership", "Crown Corporation", "Non-Profit", "Cooperative"]
SECTORS = ["Technology", "Healthcare", "Finance", "Manufacturing", "Retail", "Energy", "Education", "Construction", "Agriculture", "Mining"]


def write_csv(filename, headers, rows):
    path = os.path.join(DATA_DIR, filename)
    with open(path, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(rows)
    print(f"  Written: {filename} ({len(rows)} rows)")


def random_date(start_year=2023, end_year=2026):
    start = datetime(start_year, 1, 1)
    end = datetime(end_year, 8, 1)
    delta = (end - start).days
    return (start + timedelta(days=random.randint(0, delta))).strftime("%Y-%m-%d")


def gen_client_retention():
    """MCCSS.CLIENT_RETENTION_METRICS - Story 1 search target"""
    headers = [
        "CLIENT_ID", "RETENTION_RATE", "SERVICE_PROGRAM", "SATISFACTION_SCORE",
        "CHURN_RISK_INDICATOR", "REGION", "QUARTER", "ENGAGEMENT_FREQUENCY",
        "PROGRAM_TYPE", "SERVICE_CATEGORY", "CASE_LOAD", "RENEWAL_COUNT",
        "DROPOUT_COUNT", "AVG_INTERACTION_DAYS", "FIRST_CONTACT_DATE",
        "LAST_CONTACT_DATE", "REFERRAL_SOURCE", "CASE_COMPLEXITY",
        "NET_PROMOTER_SCORE", "RESPONSE_TIME_HOURS", "DIGITAL_ENGAGEMENT_PCT",
        "IN_PERSON_VISITS", "PHONE_INTERACTIONS", "EMAIL_INTERACTIONS",
        "BENEFITS_AMOUNT", "COST_PER_CLIENT", "FISCAL_YEAR", "DATA_QUALITY_SCORE",
        "LAST_UPDATED"
    ]
    rows = []
    for i in range(1000):
        rows.append([
            f"CLT-{i+1:06d}",
            round(random.uniform(0.4, 0.99), 3),
            random.choice(PROGRAMS_MCCSS),
            round(random.uniform(3.0, 9.8), 1),
            random.choice(RISK_LEVELS),
            random.choice(REGIONS),
            random.choice(QUARTERS),
            random.randint(1, 24),
            random.choice(SERVICE_CATEGORIES),
            random.choice(SERVICE_CATEGORIES),
            random.randint(10, 150),
            random.randint(0, 5),
            random.randint(0, 3),
            round(random.uniform(5, 90), 1),
            random_date(2020, 2024),
            random_date(2025, 2026),
            random.choice(REFERRAL_SOURCES),
            random.choice(COMPLEXITY),
            random.randint(-20, 80),
            round(random.uniform(0.5, 72), 1),
            round(random.uniform(10, 95), 1),
            random.randint(0, 20),
            random.randint(0, 30),
            random.randint(0, 50),
            round(random.uniform(500, 25000), 2),
            round(random.uniform(1000, 50000), 2),
            random.choice(FISCAL_YEARS),
            round(random.uniform(70, 100), 1),
            random_date(2026, 2026)
        ])
    write_csv("mccss_client_retention.csv", headers, rows)


def gen_customer_demographics():
    """MCCSS.CUSTOMER_DEMOGRAPHICS - Story 1 basket item"""
    headers = [
        "CLIENT_ID", "AGE_GROUP", "GENDER", "POSTAL_CODE_PREFIX", "REGION",
        "HOUSEHOLD_SIZE", "INCOME_BRACKET", "EMPLOYMENT_STATUS", "EDUCATION_LEVEL",
        "LANGUAGE_PREFERENCE", "INDIGENOUS_IDENTITY", "DISABILITY_FLAG",
        "IMMIGRATION_STATUS", "YEARS_IN_CANADA", "MARITAL_STATUS",
        "DEPENDENTS_COUNT", "HOUSING_TYPE", "DIGITAL_ACCESS", "LAST_UPDATED"
    ]
    age_groups = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"]
    genders = ["Male", "Female", "Non-Binary", "Prefer Not to Say"]
    income_brackets = ["<$20K", "$20-40K", "$40-60K", "$60-80K", "$80-100K", ">$100K"]
    employment = ["Employed FT", "Employed PT", "Unemployed", "Student", "Retired", "Self-Employed", "On Leave"]
    education = ["Less than HS", "High School", "College", "Bachelor", "Master", "Doctorate"]
    languages = ["English", "French", "Bilingual", "Other"]
    housing = ["Own", "Rent", "Social Housing", "Shelter", "Other"]
    rows = []
    for i in range(1000):
        rows.append([
            f"CLT-{i+1:06d}",
            random.choice(age_groups),
            random.choice(genders),
            random.choice(["M", "K", "L", "N", "P", "T"]) + str(random.randint(0, 9)) + random.choice("ABCDEFGHIJKLMNOPQRSTUVWXYZ"),
            random.choice(REGIONS),
            random.randint(1, 7),
            random.choice(income_brackets),
            random.choice(employment),
            random.choice(education),
            random.choice(languages),
            random.choice(["Yes", "No", "Prefer Not to Say"]),
            random.choice(["Yes", "No"]),
            random.choice(["Citizen", "PR", "Work Permit", "Refugee", "Other"]),
            random.randint(0, 50),
            random.choice(["Single", "Married", "Common-Law", "Divorced", "Widowed"]),
            random.randint(0, 5),
            random.choice(housing),
            random.choice(["Yes", "No", "Limited"]),
            random_date(2026, 2026)
        ])
    write_csv("mccss_customer_demographics.csv", headers, rows)


def gen_revenue_transactions():
    """FIN.BUSINESS_ENTITY_REVENUE_TRANSACTIONS - Story 2 restricted dataset"""
    headers = [
        "TRANSACTION_ID", "BUSINESS_ENTITY_ID", "ENTITY_NAME", "BUSINESS_TYPE",
        "SECTOR", "REVENUE_AMOUNT", "TAX_COLLECTED", "TRANSACTION_DATE",
        "FISCAL_QUARTER", "REGION", "EMPLOYEE_COUNT", "ANNUAL_REVENUE_TIER",
        "COMPLIANCE_STATUS", "AUDIT_FLAG", "BN_NUMBER", "LAST_UPDATED"
    ]
    revenue_tiers = ["<$1M", "$1-5M", "$5-25M", "$25-100M", ">$100M"]
    compliance = ["Compliant", "Under Review", "Non-Compliant", "Exempt"]
    rows = []
    for i in range(1000):
        rows.append([
            f"TXN-{i+1:08d}",
            f"BIZ-{random.randint(1, 500):05d}",
            f"Ontario Business {random.randint(1, 500)}",
            random.choice(BUSINESS_TYPES),
            random.choice(SECTORS),
            round(random.uniform(1000, 5000000), 2),
            round(random.uniform(100, 650000), 2),
            random_date(2024, 2026),
            random.choice(QUARTERS),
            random.choice(REGIONS),
            random.randint(1, 5000),
            random.choice(revenue_tiers),
            random.choice(compliance),
            random.choice(["Yes", "No"]),
            f"{random.randint(100000000, 999999999)}RC0001",
            random_date(2026, 2026)
        ])
    write_csv("fin_revenue_transactions.csv", headers, rows)


def gen_er_wait_times():
    """MOH.ER_WAIT_TIME_ANALYTICS - Story 3 publish candidate"""
    headers = [
        "VISIT_ID", "PATIENT_ID", "HOSPITAL_ID", "TRIAGE_CATEGORY",
        "WAIT_MINUTES", "TREATMENT_MINUTES", "ARRIVAL_DATE", "ARRIVAL_HOUR",
        "DISCHARGE_STATUS", "PHYSICIAN_ID", "REGION", "HOSPITAL_TYPE",
        "BED_OCCUPANCY_PCT", "AMBULANCE_ARRIVAL", "RETURN_VISIT_72H",
        "ACUITY_SCORE", "CHIEF_COMPLAINT_CATEGORY", "LAST_UPDATED"
    ]
    discharge = ["Discharged", "Admitted", "Left Without Being Seen", "Transferred", "Deceased"]
    hospital_types = ["Teaching", "Community", "Rural", "Specialty"]
    complaints = ["Chest Pain", "Abdominal Pain", "Injury", "Mental Health", "Respiratory", "Neurological", "Pediatric", "Other"]
    rows = []
    for i in range(1000):
        rows.append([
            f"VST-{i+1:08d}",
            f"PAT-{random.randint(1, 800):06d}",
            random.choice(HOSPITALS),
            random.choice(TRIAGE_CATEGORIES),
            random.randint(5, 720),
            random.randint(15, 480),
            random_date(2025, 2026),
            random.randint(0, 23),
            random.choice(discharge),
            f"DR-{random.randint(1, 200):04d}",
            random.choice(REGIONS),
            random.choice(hospital_types),
            round(random.uniform(50, 105), 1),
            random.choice(["Yes", "No"]),
            random.choice(["Yes", "No"]),
            random.randint(1, 10),
            random.choice(complaints),
            random_date(2026, 2026)
        ])
    write_csv("moh_er_wait_times.csv", headers, rows)


def gen_patient_outcome_features():
    """MOH.PATIENT_OUTCOME_FEATURES - Story 4 AI-Ready dataset"""
    headers = [
        "PATIENT_ID", "AGE", "GENDER", "CHRONIC_CONDITIONS_COUNT",
        "PREV_HOSPITALIZATIONS", "MEDICATION_COUNT", "BMI",
        "BLOOD_PRESSURE_SYSTOLIC", "BLOOD_PRESSURE_DIASTOLIC", "HBA1C",
        "READMISSION_RISK_SCORE", "MORTALITY_RISK_SCORE", "LOS_PREDICTED_DAYS",
        "COMORBIDITY_INDEX", "SOCIAL_ISOLATION_SCORE", "FEATURE_IMPORTANCE_RANK",
        "IS_TRAINING_SUITABLE", "UPDATE_FREQUENCY", "DATA_QUALITY_SCORE",
        "LAST_UPDATED"
    ]
    rows = []
    for i in range(1000):
        rows.append([
            f"PAT-{i+1:06d}",
            random.randint(18, 95),
            random.choice(["M", "F", "X"]),
            random.randint(0, 8),
            random.randint(0, 12),
            random.randint(0, 15),
            round(random.uniform(16, 45), 1),
            random.randint(90, 200),
            random.randint(50, 120),
            round(random.uniform(4.0, 14.0), 1),
            round(random.uniform(0, 1), 3),
            round(random.uniform(0, 1), 3),
            round(random.uniform(0.5, 30), 1),
            random.randint(0, 10),
            random.randint(0, 10),
            random.randint(1, 20),
            random.choice(["Yes", "Yes", "Yes", "No"]),
            random.choice(["Daily", "Weekly", "Monthly"]),
            round(random.uniform(80, 100), 1),
            random_date(2026, 2026)
        ])
    write_csv("moh_patient_outcome_features.csv", headers, rows)


def gen_student_achievement():
    """EDU.STUDENT_ACHIEVEMENT_INDICATORS - Classification demo"""
    headers = [
        "STUDENT_ID", "SCHOOL_ID", "SCHOOL_NAME", "SCHOOL_BOARD",
        "GRADE_LEVEL", "MATH_SCORE", "READING_SCORE", "GRADUATION_RATE",
        "ATTENDANCE_RATE", "POSTAL_CODE", "REGION", "PROGRAM_TYPE",
        "SPECIAL_EDUCATION", "ESL_FLAG", "INDIGENOUS_FLAG",
        "SOCIOECONOMIC_INDEX", "LAST_UPDATED"
    ]
    boards = ["TDSB", "PDSB", "OCDSB", "HWDSB", "WRDSB", "DDSB", "YRDSB", "HDSB"]
    programs = ["Regular", "French Immersion", "IB", "AP", "Arts", "STEM"]
    rows = []
    for i in range(1000):
        rows.append([
            f"STU-{i+1:07d}",
            random.choice(SCHOOLS),
            f"{random.choice(['Maple', 'Oak', 'Pine', 'Cedar', 'Birch', 'Elm'])} {random.choice(['Hill', 'Valley', 'Park', 'Ridge', 'Creek'])} {random.choice(['PS', 'SS', 'CI'])}",
            random.choice(boards),
            random.randint(1, 12),
            random.randint(40, 100),
            random.randint(40, 100),
            round(random.uniform(0.6, 0.99), 3),
            round(random.uniform(0.5, 1.0), 3),
            random.choice(["M", "K", "L", "N", "P"]) + str(random.randint(0, 9)) + random.choice("ABCDEFGHIJKLMNOP"),
            random.choice(REGIONS),
            random.choice(programs),
            random.choice(["Yes", "No"]),
            random.choice(["Yes", "No"]),
            random.choice(["Yes", "No", "No", "No"]),
            round(random.uniform(1, 10), 1),
            random_date(2026, 2026)
        ])
    write_csv("edu_student_achievement.csv", headers, rows)


def gen_road_infrastructure():
    """MTO.ROAD_INFRASTRUCTURE_METRICS - Cross-domain"""
    headers = [
        "SEGMENT_ID", "HIGHWAY_NUMBER", "REGION", "SEGMENT_LENGTH_KM",
        "LANE_COUNT", "SURFACE_TYPE", "CONDITION_INDEX", "LAST_INSPECTION_DATE",
        "TRAFFIC_VOLUME_DAILY", "ACCIDENT_COUNT_ANNUAL", "SPEED_LIMIT",
        "WINTER_MAINTENANCE_PRIORITY", "BRIDGE_COUNT", "CULVERT_COUNT",
        "REHABILITATION_YEAR", "ESTIMATED_REPLACEMENT_COST", "LAST_UPDATED"
    ]
    surfaces = ["Asphalt", "Concrete", "Gravel", "Composite"]
    priorities = ["A", "B", "C", "D"]
    rows = []
    for i in range(1000):
        rows.append([
            random.choice(ROAD_SEGMENTS),
            random.choice(["400", "401", "403", "404", "407", "410", "417", "QEW", "7", "11", "17", "69"]),
            random.choice(REGIONS),
            round(random.uniform(0.5, 50), 1),
            random.randint(2, 8),
            random.choice(surfaces),
            round(random.uniform(1, 10), 1),
            random_date(2023, 2026),
            random.randint(1000, 200000),
            random.randint(0, 50),
            random.choice([40, 50, 60, 80, 100, 110]),
            random.choice(priorities),
            random.randint(0, 5),
            random.randint(0, 10),
            random.randint(2015, 2030),
            round(random.uniform(100000, 50000000), 0),
            random_date(2026, 2026)
        ])
    write_csv("mto_road_infrastructure.csv", headers, rows)


def gen_energy_grid():
    """ENERGY.ENERGY_GRID_TELEMETRY - Cross-domain"""
    headers = [
        "READING_ID", "STATION_ID", "REGION", "READING_TIMESTAMP",
        "POWER_OUTPUT_MW", "DEMAND_MW", "FREQUENCY_HZ", "VOLTAGE_KV",
        "TEMPERATURE_C", "WIND_SPEED_KMH", "SOLAR_IRRADIANCE",
        "GENERATION_TYPE", "CAPACITY_FACTOR", "EMISSIONS_TONNES_CO2",
        "GRID_STABILITY_INDEX", "OUTAGE_FLAG", "LAST_UPDATED"
    ]
    gen_types = ["Nuclear", "Hydro", "Wind", "Solar", "Gas", "Biomass"]
    rows = []
    for i in range(1000):
        rows.append([
            f"RDG-{i+1:08d}",
            random.choice(ENERGY_STATIONS),
            random.choice(REGIONS),
            (datetime(2026, 1, 1) + timedelta(hours=random.randint(0, 5000))).strftime("%Y-%m-%d %H:%M:%S"),
            round(random.uniform(10, 3500), 1),
            round(random.uniform(8000, 25000), 1),
            round(random.uniform(59.95, 60.05), 3),
            round(random.uniform(110, 500), 1),
            round(random.uniform(-30, 35), 1),
            round(random.uniform(0, 80), 1),
            round(random.uniform(0, 1000), 1),
            random.choice(gen_types),
            round(random.uniform(0.1, 0.95), 2),
            round(random.uniform(0, 500), 1),
            round(random.uniform(0.8, 1.0), 3),
            random.choice(["No", "No", "No", "No", "Yes"]),
            random_date(2026, 2026)
        ])
    write_csv("energy_grid_telemetry.csv", headers, rows)


def gen_workforce_features():
    """LABOUR.WORKFORCE_DEVELOPMENT_FEATURES - Story 4 AI dataset"""
    headers = [
        "PARTICIPANT_ID", "AGE", "GENDER", "REGION", "EDUCATION_LEVEL",
        "PRIOR_EMPLOYMENT_MONTHS", "TRAINING_PROGRAM", "TRAINING_HOURS",
        "CERTIFICATION_EARNED", "EMPLOYMENT_OUTCOME", "SALARY_POST_TRAINING",
        "INDUSTRY_PLACED", "TIME_TO_EMPLOYMENT_DAYS", "RETENTION_6_MONTH",
        "SKILL_MATCH_SCORE", "FEATURE_IMPORTANCE_RANK", "IS_TRAINING_SUITABLE",
        "UPDATE_FREQUENCY", "LAST_UPDATED"
    ]
    training_programs = ["Digital Skills", "Skilled Trades", "Healthcare Aide", "Green Energy", "Advanced Manufacturing", "IT Security", "Data Analytics"]
    outcomes = ["Employed FT", "Employed PT", "Self-Employed", "Further Training", "Unemployed"]
    industries = ["Technology", "Healthcare", "Construction", "Manufacturing", "Retail", "Government", "Finance"]
    rows = []
    for i in range(1000):
        rows.append([
            f"PRT-{i+1:06d}",
            random.randint(18, 64),
            random.choice(["M", "F", "X"]),
            random.choice(REGIONS),
            random.choice(["Less than HS", "High School", "College", "Bachelor", "Master"]),
            random.randint(0, 240),
            random.choice(training_programs),
            random.randint(40, 800),
            random.choice(["Yes", "No"]),
            random.choice(outcomes),
            random.randint(30000, 120000),
            random.choice(industries),
            random.randint(7, 180),
            random.choice(["Yes", "No"]),
            round(random.uniform(0.3, 1.0), 2),
            random.randint(1, 18),
            random.choice(["Yes", "Yes", "Yes", "No"]),
            random.choice(["Weekly", "Monthly"]),
            random_date(2026, 2026)
        ])
    write_csv("labour_workforce_features.csv", headers, rows)


if __name__ == "__main__":
    print("Generating OPS Data Marketplace sample data...")
    print(f"Output directory: {DATA_DIR}")
    print()
    gen_client_retention()
    gen_customer_demographics()
    gen_revenue_transactions()
    gen_er_wait_times()
    gen_patient_outcome_features()
    gen_student_achievement()
    gen_road_infrastructure()
    gen_energy_grid()
    gen_workforce_features()
    print("\nDone! All 9 CSVs generated.")
