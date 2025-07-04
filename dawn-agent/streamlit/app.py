import streamlit as st
import asyncio
import sys
import os

# Add the parent directory to the path to import agents
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agents.AIDA import AIDA
# For now, let's comment out the other agents until we fix them
# from agents.adhd_diagnostic_agent import ADHDDiagnosticAgent
# from agents.dyslexia_diagnostic_agent import DyslexiaDiagnosticAgent

st.set_page_config(
    page_title="DAWN AI Agent",
    page_icon="🌅",
    layout="wide"
)

st.title("🌅 DAWN AI Learning Assistant")
st.subheader("Personalized AI support for students with learning differences")

# Sidebar for agent selection
st.sidebar.header("Agent Selection")
agent_type = st.sidebar.selectbox(
    "Choose an AI Assistant:",
    ["AIDA (General Learning)"]  # Simplified for now
    # ["AIDA (General Learning)", "ADHD Diagnostic", "Dyslexia Diagnostic"]
)

# Initialize session state
if "messages" not in st.session_state:
    st.session_state.messages = []

if "current_agent" not in st.session_state:
    st.session_state.current_agent = None

# Initialize the selected agent
if agent_type == "AIDA (General Learning)":
    if st.session_state.current_agent != "aida":
        st.session_state.current_agent = "aida"
        st.session_state.agent = AIDA
        st.session_state.messages = []
        st.success("AIDA Agent initialized - Ready to help with learning support!")
# elif agent_type == "ADHD Diagnostic":
#     if st.session_state.current_agent != "adhd":
#         st.session_state.current_agent = "adhd"
#         st.session_state.agent = ADHDDiagnosticAgent()
#         st.session_state.messages = []
#         st.success("ADHD Diagnostic Agent initialized - Ready to help with ADHD assessment!")
# elif agent_type == "Dyslexia Diagnostic":
#     if st.session_state.current_agent != "dyslexia":
#         st.session_state.current_agent = "dyslexia"
#         st.session_state.agent = DyslexiaDiagnosticAgent()
#         st.session_state.messages = []
#         st.success("Dyslexia Diagnostic Agent initialized - Ready to help with dyslexia assessment!")

# Display chat messages
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# Chat input
if prompt := st.chat_input("How can I help you today?"):
    # Add user message to chat history
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    # Get agent response
    with st.chat_message("assistant"):
        with st.spinner("Thinking..."):
            try:
                # Run the agent
                if hasattr(st.session_state.agent, 'run'):
                    response = asyncio.run(st.session_state.agent.run(prompt))
                    if hasattr(response, 'data'):
                        response_text = str(response.data)
                    else:
                        response_text = str(response)
                else:
                    response_text = "Agent not properly initialized. Please try selecting an agent again."
                
                st.markdown(response_text)
                
                # Add assistant response to chat history
                st.session_state.messages.append({"role": "assistant", "content": response_text})
                
            except Exception as e:
                error_msg = f"Error: {str(e)}"
                st.error(error_msg)
                st.session_state.messages.append({"role": "assistant", "content": error_msg})

# Sidebar info
st.sidebar.markdown("---")
st.sidebar.markdown("### About DAWN")
st.sidebar.markdown("""
DAWN is an AI-powered Learning Management System designed specifically for students with learning differences like ADHD and dyslexia.

**Features:**
- Personalized learning paths
- AI-powered diagnostic tools
- Accessibility-first design
- Real-time progress tracking
""")

if st.sidebar.button("Clear Chat History"):
    st.session_state.messages = []
    st.rerun()

# Development info
if st.sidebar.button("Development Info"):
    st.sidebar.json({
        "Status": "Development Mode",
        "Agent": agent_type,
        "Port": "8000",
        "Database": "Connected" if os.getenv("DATABASE_URL") else "Not Connected",
        "OpenAI": "Configured" if os.getenv("OPENAI_API_KEY") else "Not Configured"
    }) 