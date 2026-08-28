import streamlit as st
import json
import pandas as pd
from snowflake.snowpark.context import get_active_session

session = get_active_session()
st.set_page_config(page_title="OPS Governance Console", layout="wide")

st.markdown("""
<style>
/* FORCE LIGHT THEME */
.stApp, .stApp > div, .stApp [data-testid="stAppViewContainer"],
.stApp [data-testid="stVerticalBlock"],
[data-testid="stAppViewBlockContainer"] {
    background-color: #ffffff !important;
    color: #11181c !important;
}
[data-testid="stHeader"] { background-color: #ffffff !important; border-bottom: 1px solid #e8ecf0 !important; }
.stApp p, .stApp span, .stApp label, .stApp div, .stMarkdown { color: #11181c !important; }
h1 { color: #0f2b46 !important; font-weight: 700 !important; font-size: 2rem !important; }
h2 { color: #1A73E8 !important; font-weight: 600 !important; }
h3 { color: #1A73E8 !important; font-weight: 600 !important; }
[data-testid="stCaptionContainer"] p { color: #5a6f7e !important; }

/* Metrics - blue gradient cards */
[data-testid="stMetric"] { background: linear-gradient(135deg, #f0f7ff 0%, #e8f4fd 100%) !important; border: 1px solid #bdd8f2 !important; border-radius: 12px !important; padding: 16px 20px !important; }
[data-testid="stMetricLabel"] p { color: #3b6d99 !important; font-size: 0.72rem !important; text-transform: uppercase !important; letter-spacing: 0.6px !important; font-weight: 600 !important; }
[data-testid="stMetricValue"] div { color: #0f2b46 !important; font-weight: 800 !important; font-size: 2.2rem !important; }

/* TABS - #1A73E8 blue, no red */
div[data-testid="stTabs"] button { color: #5a6f7e !important; background: transparent !important; font-weight: 500 !important; }
div[data-testid="stTabs"] button[aria-selected="true"] { color: #1A73E8 !important; font-weight: 600 !important; }
[data-baseweb="tab-highlight"] { background-color: #1A73E8 !important; }
[data-baseweb="tab-border"] { background-color: #e0eaf4 !important; }
div[data-testid="stTabs"] > div > div:nth-child(2) { background-color: #1A73E8 !important; }
div[data-testid="stTabs"] > div[role="tablist"] > div:last-child { background-color: #1A73E8 !important; }

/* Expanders */
[data-testid="stExpander"] { background: #f8fbff !important; border: 1px solid #d4e4f7 !important; border-radius: 10px !important; margin-bottom: 12px !important; }
[data-testid="stExpander"] summary span { color: #0f2b46 !important; font-weight: 500 !important; }
details[data-testid="stExpander"] > div { background: #ffffff !important; }

/* Inputs */
.stSelectbox > div > div, .stMultiSelect > div > div { background-color: #ffffff !important; color: #11181c !important; border-color: #c5d4e3 !important; }
.stSelectbox label, .stMultiSelect label, .stTextInput label { color: #2c4a63 !important; font-weight: 500 !important; }

/* BUTTONS - #1A73E8 */
.stButton > button, .stButton > button[kind="primary"], .stButton > button[kind="secondary"],
button[data-testid="stBaseButton-primary"], button[data-testid="stBaseButton-secondary"] { border-radius: 8px !important; }
.stButton > button[kind="primary"], button[data-testid="stBaseButton-primary"] { background-color: #1A73E8 !important; color: #ffffff !important; border: none !important; }
.stButton > button[kind="primary"]:hover, button[data-testid="stBaseButton-primary"]:hover { background-color: #1557B0 !important; color: #ffffff !important; }
.stButton > button[kind="primary"] p, .stButton > button[kind="primary"] span, .stButton > button[kind="primary"] div,
button[data-testid="stBaseButton-primary"] p, button[data-testid="stBaseButton-primary"] span, button[data-testid="stBaseButton-primary"] div { color: #ffffff !important; }
.stButton > button:not([kind="primary"]) { background-color: #ffffff !important; color: #1A73E8 !important; border: 1px solid #B4D4F7 !important; }
.stButton > button:not([kind="primary"]):hover { background-color: #EBF3FD !important; color: #1557B0 !important; border: 1px solid #1A73E8 !important; }

hr { border-color: #e0eaf4 !important; }
[data-testid="stDataFrame"] { border: 1px solid #d4e4f7 !important; border-radius: 8px !important; }
</style>
""", unsafe_allow_html=True)

st.title("OPS Data Governance Console")
st.caption("Enterprise Data Stewardship Division - Governance Operations")

col_role, _ = st.columns([1, 3])
with col_role:
    active_role = st.selectbox("Active Persona", ["Data Steward", "Data Owner", "Administrator"])

tab_access, tab_quality, tab_classify, tab_publish, tab_usage = st.tabs(["Access Requests", "Data Quality", "Classification", "Publishing", "Usage & Adoption"])

with tab_access:
    st.header("Access Requests")
    try:
        requests_df = session.sql("SELECT REQUEST_ID, REQUESTOR_ROLE, REQUESTOR_NAME, TARGET_TABLE, PURPOSE, SENSITIVITY_LEVEL, STATUS, APPROVED_BY, REQUESTED_AT, RESOLVED_AT, POLICY_EVALUATION FROM ON_GOVERNANCE_RFS.PUBLIC.ACCESS_REQUESTS ORDER BY REQUESTED_AT DESC").to_pandas()
    except Exception as e:
        st.error(f"Error: {e}")
        requests_df = pd.DataFrame()

    if not requests_df.empty:
        c1, c2, c3, c4 = st.columns(4)
        c1.metric("Total", len(requests_df))
        c2.metric("Pending", len(requests_df[requests_df["STATUS"] == "PENDING"]))
        c3.metric("Approved", len(requests_df[requests_df["STATUS"] == "APPROVED"]))
        c4.metric("Rejected", len(requests_df[requests_df["STATUS"] == "REJECTED"]))
        st.divider()
        pending = requests_df[requests_df["STATUS"] == "PENDING"]
        if not pending.empty:
            st.subheader(f"Pending Requests ({len(pending)})")
            for _, req in pending.iterrows():
                with st.expander(f"{req['REQUESTOR_NAME']} -> {req['TARGET_TABLE']}", expanded=True):
                    ca, cb = st.columns(2)
                    with ca:
                        st.write(f"**Requestor:** {req['REQUESTOR_NAME']}")
                        st.write(f"**Role:** {req['REQUESTOR_ROLE']}")
                        st.write(f"**Target:** {req['TARGET_TABLE']}")
                        st.write(f"**Sensitivity:** {req['SENSITIVITY_LEVEL']}")
                    with cb:
                        st.write(f"**Purpose:** {req['PURPOSE']}")
                        if req["POLICY_EVALUATION"]:
                            try:
                                pol = json.loads(req["POLICY_EVALUATION"])
                                st.write(f"**Policy:** {pol.get('policy','N/A')}")
                                st.write(f"**Routed to:** {pol.get('routed_to','N/A')}")
                            except:
                                pass
                    c_app, c_rej, _ = st.columns([1, 1, 3])
                    rid = req['REQUEST_ID']
                    with c_app:
                        if st.button("Approve", key=f"a_{rid}", type="primary"):
                            try:
                                session.sql(f"CALL ON_GOVERNANCE_RFS.PUBLIC.PROVISION_ACCESS('{rid}')").collect()
                                st.success(f"Access GRANTED to {req['REQUESTOR_ROLE']}")
                                st.balloons()
                                st.experimental_rerun()
                            except Exception as e:
                                st.error(str(e))
                    with c_rej:
                        if st.button("Reject", key=f"r_{rid}"):
                            try:
                                session.sql(f"UPDATE ON_GOVERNANCE_RFS.PUBLIC.ACCESS_REQUESTS SET STATUS='REJECTED',APPROVED_BY=CURRENT_USER(),RESOLVED_AT=CURRENT_TIMESTAMP() WHERE REQUEST_ID='{rid}'").collect()
                                st.experimental_rerun()
                            except Exception as e:
                                st.error(str(e))
        st.subheader("History")
        hist = requests_df[requests_df["STATUS"] != "PENDING"]
        if not hist.empty:
            st.dataframe(hist[["REQUESTOR_NAME", "TARGET_TABLE", "STATUS", "APPROVED_BY", "RESOLVED_AT"]], use_container_width=True)
    st.divider()
    st.subheader("Live Access Verification")
    vr = st.selectbox("Role", ["OPS_GENERAL_USER", "OPS_DATA_ANALYST", "OPS_DATA_SCIENTIST", "OPS_CONTRIBUTOR"])
    if st.button("Show Grants"):
        try:
            session.sql(f"SHOW GRANTS TO ROLE {vr}").collect()
            gdf = session.sql('SELECT "privilege", "granted_on", "name" FROM TABLE(RESULT_SCAN(LAST_QUERY_ID())) WHERE "privilege" = \'SELECT\' AND "granted_on" = \'TABLE\'').to_pandas()
            if not gdf.empty:
                st.write(f"**{vr}** has SELECT access to **{len(gdf)} tables:**")
                for _, g in gdf.iterrows():
                    st.write(f"- `{g['name']}`")
            else:
                st.info(f"{vr} has no direct TABLE grants.")
        except Exception as e:
            st.error(str(e))

with tab_quality:
    st.header("Data Quality Monitoring")
    try:
        qdf = session.sql("SELECT TABLE_SCHEMA,TABLE_NAME,METRIC_NAME,VALUE,MEASUREMENT_TIME FROM SNOWFLAKE.LOCAL.DATA_QUALITY_MONITORING_RESULTS WHERE TABLE_DATABASE='ON_GOVERNANCE_RFS' ORDER BY MEASUREMENT_TIME DESC LIMIT 100").to_pandas()
        if not qdf.empty:
            st.dataframe(qdf, use_container_width=True)
        else:
            st.info("No DMF results yet. Insert data to trigger measurements.")
    except:
        st.info("DMF results not yet available.")
    st.subheader("Attached DMFs")
    tc = st.selectbox("Table", ["MOH.ER_WAIT_TIME_ANALYTICS", "MCCSS.CLIENT_RETENTION_METRICS", "FIN.BUSINESS_ENTITY_REVENUE_TRANSACTIONS"])
    if st.button("Show DMFs"):
        try:
            sql = f"SELECT METRIC_NAME,REF_ENTITY_NAME,SCHEDULE FROM TABLE(INFORMATION_SCHEMA.DATA_METRIC_FUNCTION_REFERENCES(REF_ENTITY_NAME=>'ON_GOVERNANCE_RFS.{tc}',REF_ENTITY_DOMAIN=>'TABLE'))"
            st.dataframe(session.sql(sql).to_pandas(), use_container_width=True)
        except Exception as e:
            st.error(str(e))

with tab_classify:
    st.header("AI-Driven Classification")
    ct = st.selectbox("Table to Classify", ["EDU.STUDENT_ACHIEVEMENT_INDICATORS", "MCCSS.CLIENT_RETENTION_METRICS", "FIN.BUSINESS_ENTITY_REVENUE_TRANSACTIONS"])
    if st.button("Run SYSTEM$CLASSIFY", type="primary"):
        with st.spinner("Classifying..."):
            try:
                sql = f"SELECT PARSE_JSON(SYSTEM$CLASSIFY('ON_GOVERNANCE_RFS.{ct}',{{'auto_tag':false}})) AS C"
                r = session.sql(sql).to_pandas()
                if not r.empty:
                    cls = json.loads(r.iloc[0]["C"])
                    st.success(f"Done - {len(cls)} columns analyzed")
                    for cn, cd in cls.items():
                        if isinstance(cd, dict) and cd.get("alternates"):
                            top = cd["alternates"][0] if cd["alternates"] else {}
                            conf = top.get("confidence", "N/A")
                            cat = top.get("privacy_category", top.get("semantic_category", "N/A"))
                            color = "blue" if conf == "HIGH" else "orange"
                            st.markdown(f"**{cn}** - :{color}[{conf}] | `{cat}`")
            except Exception as e:
                st.error(str(e))

with tab_publish:
    st.header("Publishing Portal")
    pt = st.selectbox("Dataset", ["EDU.STUDENT_ACHIEVEMENT_INDICATORS", "MOH.ER_WAIT_TIME_ANALYTICS", "MCCSS.CLIENT_RETENTION_METRICS"])
    cc, cd = st.columns(2)
    with cc:
        cl = st.selectbox("Certification", ["Draft", "Certified", "Authoritative"])
    with cd:
        dm = st.multiselect("Delivery", ["TABLE", "VIEW", "API", "FEATURE_TABLE"], default=["TABLE"])
    if st.button("Validate", type="primary"):
        with st.spinner("Validating..."):
            try:
                schema, table = pt.split(".")
                sql = f"CALL ON_GOVERNANCE_RFS.PUBLIC.VALIDATE_FOR_PUBLISH('{schema}','{table}')"
                result = session.sql(sql).to_pandas()
                if not result.empty:
                    val = json.loads(result.iloc[0][0])
                    for ch in val.get("checks", []):
                        name = ch["name"]
                        value = ch.get("value", "")
                        passed = ch["passed"]
                        icon = "\u2705" if passed else "\u274c"
                        st.markdown(f"{icon} **{name}** - {value}")
                    if val.get("publish_ready"):
                        st.success("Ready to publish!")
                    else:
                        st.warning("Fix issues above.")
            except Exception as e:
                st.error(str(e))

with tab_usage:
    st.header("Usage & Adoption")
    try:
        udf = session.sql("SELECT SPLIT_PART(query_text,'FROM ',2) AS obj,COUNT(*) AS queries,COUNT(DISTINCT user_name) AS users FROM SNOWFLAKE.ACCOUNT_USAGE.QUERY_HISTORY WHERE database_name='ON_GOVERNANCE_RFS' AND query_type='SELECT' AND start_time>DATEADD(day,-30,CURRENT_TIMESTAMP()) GROUP BY 1 HAVING queries>1 ORDER BY queries DESC LIMIT 15").to_pandas()
        if not udf.empty:
            c1, c2 = st.columns(2)
            c1.metric("Queries (30d)", int(udf["QUERIES"].sum()))
            c2.metric("Users", int(udf["USERS"].sum()))
            st.dataframe(udf, use_container_width=True)
        else:
            st.info("No query activity yet.")
    except Exception as e:
        st.info(f"Needs ACCOUNT_USAGE access: {e}")
    st.subheader("Request Metrics")
    try:
        rm = session.sql("SELECT STATUS,COUNT(*) AS CNT FROM ON_GOVERNANCE_RFS.PUBLIC.ACCESS_REQUESTS GROUP BY STATUS").to_pandas()
        if not rm.empty:
            st.bar_chart(rm.set_index("STATUS"))
    except:
        pass
