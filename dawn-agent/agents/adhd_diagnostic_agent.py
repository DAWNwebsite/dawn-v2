from pydantic_ai import Agent, ModelRetry, RunContext
from pydantic_ai.providers.groq import GroqProvider
from pydantic_ai.models.groq import GroqModel
from dotenv import load_dotenv
from dataclasses import dataclass
import logfire
import os

load_dotenv()

llm = os.getenv("PRIMARY_MODEL")
model = GroqModel(llm , provider=GroqProvider(api_key={os.getenv("GROQ_API_KEY")}))
agent = Agent(model)

logfire.configure(send_to_logfire='if-token-present')

system_prompt = """

"""

adhd_diagnostic_agent= Agent(
    model,
    system_prompt=system_prompt,
    # deps_type=,
    retries=2
)


