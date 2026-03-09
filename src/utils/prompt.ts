import type { ProjectInput } from "@/types/project"

export function buildProjectPrompt({ skill, level, projectType }: ProjectInput) {
  return `You are a senior full-stack software architect and technical writer.
Generate exactly one project idea in clean GitHub-flavored Markdown.

The project must be tailored for:
- Skill: ${skill}
- Difficulty Level: ${level}
- Project Type: ${projectType}

Output rules:
- Return markdown only.
- Use clear headings and bullet points.
- Keep tone practical and implementation-focused.
- Include realistic technologies and workflows.
- Provide code blocks for folder structure and terminal commands when relevant.

Your output must contain these sections in this order:
1. Project Title
2. Project Description
3. Problem It Solves
4. Core Features
5. Learning Outcomes
6. Recommended Tech Stack
7. Suggested Folder Structure
8. Step-by-Step Development Plan
9. Possible Enhancements
10. Complete GitHub README.md

Inside "Complete GitHub README.md", provide a full README with these sections:
- Project Title
- Description
- Features
- Tech Stack
- Installation
- Usage
- Future Improvements
- MIT License

Critical README rules:
- DO NOT wrap the README in triple backticks.
- Output raw README markdown content directly.
- Include a complete MIT License section with the standard permission notice text.

For the README section, render it as a markdown document that can be copied directly into a README.md file.`
}
