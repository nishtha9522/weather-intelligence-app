import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import os
import io
import datetime

# Set Page Config
st.set_page_config(
    page_title="Retail Sales Intelligence Dashboard",
    page_icon="🛍️",
    layout="wide",
    initial_sidebar_state="expanded"
)

st.title("🛍️ Retail Sales Intelligence Dashboard")
st.markdown("An executive-grade analytics platform for tracking retail sales performance, targets, return rates, and stockout risks.")

# Helper Functions for Data Cleaning
@st.cache_data
def clean_currency_and_numbers(val):
    if pd.isna(val) or val == "":
        return np.nan
    if isinstance(val, (int, float)):
        return float(val)
    # Strip currency symbols and commas
    cleaned = str(val).replace("$", "").replace(",", "").strip()
    try:
        return float(cleaned)
    except ValueError:
        return np.nan

@st.cache_data
def parse_flexible_dates(date_series):
    return pd.to_datetime(date_series, errors='coerce')

@st.cache_data
def load_and_clean_data(sales_file, store_file):
    # Load Sales File
    if sales_file is not None:
        if sales_file.name.endswith('.csv'):
            sales_df = pd.read_csv(sales_file)
        else:
            sales_df = pd.read_excel(sales_file)
    else:
        sales_path = "./data/retail_weekly_sales.csv"
        sales_df = pd.read_csv(sales_path) if os.path.exists(sales_path) else pd.DataFrame()

    # Load Store Master File
    if store_file is not None:
        if store_file.name.endswith('.csv'):
            store_df = pd.read_csv(store_file)
        else:
            store_df = pd.read_excel(store_file)
    else:
        store_path = "./data/store_master.csv"
        store_df = pd.read_csv(store_path) if os.path.exists(store_path) else pd.DataFrame()

    if sales_df.empty:
        return pd.DataFrame()

    # Data Cleaning
    num_cols = ['gross_sales', 'discount_amount', 'net_sales', 'sales_target', 
                'returns_amount', 'transactions_count', 'footfall', 'inventory_on_hand', 'stockout_events']
    for col in num_cols:
        if col in sales_df.columns:
            sales_df[col] = sales_df[col].apply(clean_currency_and_numbers)

    # Fill missing net_sales as (gross_sales - discount_amount)
    if 'gross_sales' in sales_df.columns and 'discount_amount' in sales_df.columns:
        sales_df['gross_sales'] = sales_df['gross_sales'].fillna(0)
        sales_df['discount_amount'] = sales_df['discount_amount'].fillna(0)
        calculated_net = sales_df['gross_sales'] - sales_df['discount_amount']
        if 'net_sales' in sales_df.columns:
            sales_df['net_sales'] = sales_df['net_sales'].fillna(calculated_net)
        else:
            sales_df['net_sales'] = calculated_net

    # Parse mixed dates
    if 'week_ending_date' in sales_df.columns:
        sales_df['week_ending_date'] = parse_flexible_dates(sales_df['week_ending_date'])

    # Merge with Store Master
    if not store_df.empty and 'store_id' in sales_df.columns and 'store_id' in store_df.columns:
        merged_df = pd.merge(sales_df, store_df, on='store_id', how='left')
    else:
        merged_df = sales_df

    return merged_df

# Sidebar - Data Upload
st.sidebar.header("📁 Data Ingestion")
sales_file_input = st.sidebar.file_uploader("Upload Weekly Sales (`retail_weekly_sales.xlsx`/`.csv`)", type=['csv', 'xlsx'])
store_file_input = st.sidebar.file_uploader("Upload Store Master (`store_master.xlsx`/`.csv`)", type=['csv', 'xlsx'])

df = load_and_clean_data(sales_file_input, store_file_input)

if df.empty:
    st.error("No data available. Please upload sales and store master files or ensure `./data` contains default CSV files.")
    st.stop()

# Sidebar - Global Filters
st.sidebar.header("🔍 Global Filters")

# Date Filter
if 'week_ending_date' in df.columns and not df['week_ending_date'].isnull().all():
    min_date = df['week_ending_date'].min().date()
    max_date = df['week_ending_date'].max().date()
    selected_dates = st.sidebar.date_input("Date Range", value=(min_date, max_date), min_value=min_date, max_value=max_date)
    if isinstance(selected_dates, tuple) and len(selected_dates) == 2:
        start_d, end_d = selected_dates
        df = df[(df['week_ending_date'].dt.date >= start_d) & (df['week_ending_date'].dt.date <= end_d)]

# Region Filter
regions = sorted(df['region'].dropna().unique()) if 'region' in df.columns else []
selected_regions = st.sidebar.multiselect("Region", options=regions, default=regions)
if selected_regions and 'region' in df.columns:
    df = df[df['region'].isin(selected_regions)]

# Store Format Filter
formats = sorted(df['store_format'].dropna().unique()) if 'store_format' in df.columns else []
selected_formats = st.sidebar.multiselect("Store Format", options=formats, default=formats)
if selected_formats and 'store_format' in df.columns:
    df = df[df['store_format'].isin(selected_formats)]

# City Filter
cities = sorted(df['city'].dropna().unique()) if 'city' in df.columns else []
selected_cities = st.sidebar.multiselect("City", options=cities, default=cities)
if selected_cities and 'city' in df.columns:
    df = df[df['city'].isin(selected_cities)]

# Store Name Filter
stores = sorted(df['store_name'].dropna().unique()) if 'store_name' in df.columns else []
selected_stores = st.sidebar.multiselect("Store Name", options=stores, default=stores)
if selected_stores and 'store_name' in df.columns:
    df = df[df['store_name'].isin(selected_stores)]

# Category Filter
categories = sorted(df['product_category'].dropna().unique()) if 'product_category' in df.columns else []
selected_cats = st.sidebar.multiselect("Product Category", options=categories, default=categories)
if selected_cats and 'product_category' in df.columns:
    df = df[df['product_category'].isin(selected_cats)]

# Calculations
tot_net_sales = df['net_sales'].sum() if 'net_sales' in df.columns else 0
tot_gross_sales = df['gross_sales'].sum() if 'gross_sales' in df.columns else 0
tot_target = df['sales_target'].sum() if 'sales_target' in df.columns else 0
tot_returns = df['returns_amount'].sum() if 'returns_amount' in df.columns else 0
tot_discounts = df['discount_amount'].sum() if 'discount_amount' in df.columns else 0
tot_transactions = df['transactions_count'].sum() if 'transactions_count' in df.columns else 0
tot_footfall = df['footfall'].sum() if 'footfall' in df.columns else 0

target_achievement = (tot_net_sales / tot_target * 100) if tot_target > 0 else 0
atv = (tot_net_sales / tot_transactions) if tot_transactions > 0 else 0
return_rate = (tot_returns / tot_net_sales * 100) if tot_net_sales > 0 else 0
discount_rate = (tot_discounts / tot_gross_sales * 100) if tot_gross_sales > 0 else 0
conversion_rate = (tot_transactions / tot_footfall * 100) if tot_footfall > 0 else 0

# KPI Display
st.markdown("### 📊 Key Performance Indicators")
col1, col2, col3, col4, col5, col6 = st.columns(6)

col1.metric("Total Net Sales", f"${tot_net_sales:,.0f}")
col2.metric("Target Achievement", f"{target_achievement:.1f}%", delta=f"{target_achievement-100:.1f}% vs Target")
col3.metric("Avg Transaction (ATV)", f"${atv:.2f}")
col4.metric("Return Rate", f"{return_rate:.2f}%")
col5.metric("Discount Rate", f"{discount_rate:.2f}%")
col6.metric("Conversion Rate", f"{conversion_rate:.2f}%")

st.markdown("---")

# Visualizations Row 1
c1, c2 = st.columns(2)

with c1:
    st.subheader("📈 Weekly Net Sales vs. Target Trend")
    if 'week_ending_date' in df.columns:
        weekly = df.groupby('week_ending_date').agg({'net_sales': 'sum', 'sales_target': 'sum'}).reset_index()
        fig1 = go.Figure()
        fig1.add_trace(go.Scatter(x=weekly['week_ending_date'], y=weekly['net_sales'], mode='lines+markers', name='Net Sales', line=dict(color='#2563EB', width=3)))
        fig1.add_trace(go.Scatter(x=weekly['week_ending_date'], y=weekly['sales_target'], mode='lines', name='Sales Target', line=dict(color='#DC2626', dash='dash', width=2)))
        fig1.update_layout(xaxis_title="Week Ending", yaxis_title="Amount ($)", hovermode="x unified")
        st.plotly_chart(fig1, use_container_width=True)

with c2:
    st.subheader("🗺️ Sales & Target Achievement by Region")
    if 'region' in df.columns:
        reg_df = df.groupby('region').agg({'net_sales': 'sum', 'sales_target': 'sum'}).reset_index()
        reg_df['achievement_%'] = (reg_df['net_sales'] / reg_df['sales_target'] * 100).round(1)
        fig2 = px.bar(reg_df, x='region', y=['net_sales', 'sales_target'], barmode='group',
                      labels={'value': 'Sales ($)', 'region': 'Region', 'variable': 'Metric'},
                      color_discrete_map={'net_sales': '#10B981', 'sales_target': '#9CA3AF'})
        st.plotly_chart(fig2, use_container_width=True)

# Visualizations Row 2
c3, c4 = st.columns(2)

with c3:
    st.subheader("🏷️ Category Performance & Return Rate")
    if 'product_category' in df.columns:
        cat_df = df.groupby('product_category').agg({'net_sales': 'sum', 'returns_amount': 'sum'}).reset_index()
        cat_df['return_rate_%'] = (cat_df['returns_amount'] / cat_df['net_sales'] * 100).round(2)
        fig3 = make_subplots(specs=[[{"secondary_y": True}]])
        fig3.add_trace(go.Bar(x=cat_df['product_category'], y=cat_df['net_sales'], name="Net Sales ($)", marker_color='#3B82F6'), secondary_y=False)
        fig3.add_trace(go.Scatter(x=cat_df['product_category'], y=cat_df['return_rate_%'], name="Return Rate (%)", mode='lines+markers', line=dict(color='#EF4444', width=3)), secondary_y=True)
        fig3.update_yaxes(title_text="Net Sales ($)", secondary_y=False)
        fig3.update_yaxes(title_text="Return Rate (%)", secondary_y=True)
        st.plotly_chart(fig3, use_container_width=True)

with c4:
    st.subheader("🏆 Store Leaderboard (Top & Bottom)")
    if 'store_name' in df.columns:
        store_leader = df.groupby('store_name').agg({'net_sales': 'sum', 'sales_target': 'sum'}).reset_index()
        store_leader = store_leader.sort_values('net_sales', ascending=True)
        fig4 = px.bar(store_leader, y='store_name', x='net_sales', orientation='h', color='net_sales',
                      color_continuous_scale='Blues', labels={'net_sales': 'Net Sales ($)', 'store_name': 'Store'})
        st.plotly_chart(fig4, use_container_width=True)

# Stockout Risk Analysis
st.subheader("⚠️ Stockout Risk Analysis (Stockouts vs. Inventory on Hand)")
if 'product_category' in df.columns and 'stockout_events' in df.columns and 'inventory_on_hand' in df.columns:
    stock_df = df.groupby(['store_name', 'product_category']).agg({
        'stockout_events': 'sum',
        'inventory_on_hand': 'mean',
        'net_sales': 'sum'
    }).reset_index()
    fig5 = px.scatter(stock_df, x='inventory_on_hand', y='stockout_events', size='net_sales', color='product_category',
                      hover_data=['store_name'], labels={'inventory_on_hand': 'Avg Inventory on Hand', 'stockout_events': 'Total Stockout Events'})
    st.plotly_chart(fig5, use_container_width=True)

st.markdown("---")

# Automated Business Insights
st.subheader("💡 Automated Business Insights & Executive Alerts")

# Region Insights
if 'region' in df.columns and not reg_df.empty:
    top_reg = reg_df.sort_values('net_sales', ascending=False).iloc[0]
    bot_reg = reg_df.sort_values('net_sales', ascending=True).iloc[0]
    st.info(f"🏆 **Top Region:** {top_reg['region']} (${top_reg['net_sales']:,.0f}, {top_reg['achievement_%']}% of target)  \n"
            f"⚠️ **Underperforming Region:** {bot_reg['region']} (${bot_reg['net_sales']:,.0f}, {bot_reg['achievement_%']}% of target)")

# Target Misses (<80%)
if 'store_name' in df.columns:
    s_perf = df.groupby(['store_name', 'region']).agg({'net_sales': 'sum', 'sales_target': 'sum'}).reset_index()
    s_perf['achievement'] = (s_perf['net_sales'] / s_perf['sales_target'] * 100)
    low_perf = s_perf[s_perf['achievement'] < 80]
    if not low_perf.empty:
        st.warning(f"🔻 **{len(low_perf)} Stores Missing Target (<80% Achievement):**")
        st.dataframe(low_perf[['store_name', 'region', 'net_sales', 'sales_target', 'achievement']].style.format({'net_sales': '${:,.0f}', 'sales_target': '${:,.0f}', 'achievement': '{:.1f}%'}))
    else:
        st.success("🎉 All stores are achieving at least 80% of their sales target!")

# High Return Categories (>7%)
if 'product_category' in df.columns and not cat_df.empty:
    high_ret = cat_df[cat_df['return_rate_%'] > 7]
    if not high_ret.empty:
        st.error(f"🚨 **High Return Rate Threshold Alert (> 7.0%):** " + ", ".join([f"{r['product_category']} ({r['return_rate_%']}%)" for _, r in high_ret.iterrows()]))

# Data Export
st.markdown("---")
st.subheader("📥 Data Export & Executive Report")

col_e1, col_e2 = st.columns(2)

with col_e1:
    csv_data = df.to_csv(index=False).encode('utf-8')
    st.download_button("📥 Download Filtered Sales Data (CSV)", data=csv_data, file_name="filtered_retail_sales.csv", mime="text/csv")

with col_e2:
    exec_summary = f"""# RETAIL SALES INTELLIGENCE EXECUTIVE SUMMARY
Generated: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M')}

## Key Metrics Summary
- Total Net Sales: ${tot_net_sales:,.2f}
- Target Achievement Rate: {target_achievement:.2f}%
- Average Transaction Value: ${atv:.2f}
- Return Rate: {return_rate:.2f}%
- Discount Rate: {discount_rate:.2f}%
- Conversion Rate: {conversion_rate:.2f}%

## Strategic Insights
- Top Performing Region: {top_reg['region'] if 'top_reg' in locals() else 'N/A'}
- Stores Under 80% Target: {len(low_perf) if 'low_perf' in locals() else 0} stores needing operational support.
- High Return Risk Categories: {", ".join(high_ret['product_category'].tolist()) if 'high_ret' in locals() and not high_ret.empty else 'None'}
"""
    st.download_button("📄 Download Executive Summary Report (.txt)", data=exec_summary, file_name="Executive_Retail_Sales_Summary.txt", mime="text/plain")

st.sidebar.markdown("---")
st.sidebar.info("📧 Automated Weekly Email Alerts configured to send every Monday at 8:00 AM EST to stakeholders.")
