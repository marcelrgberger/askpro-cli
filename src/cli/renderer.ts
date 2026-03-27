import chalk from 'chalk';

/**
 * Render markdown text for terminal output.
 * Converts markdown formatting to chalk-styled terminal text.
 */
export function renderMarkdown(text: string): string {
  return text
    .split('\n')
    .map((line) => {
      // Headers
      if (line.match(/^#{1,3}\s/)) {
        const content = line.replace(/^#{1,3}\s+/, '');
        return chalk.bold(content);
      }

      // Bold + italic
      line = line.replace(/\*\*\*(.+?)\*\*\*/g, (_, t) => chalk.bold.italic(t));
      // Bold
      line = line.replace(/\*\*(.+?)\*\*/g, (_, t) => chalk.bold(t));
      // Italic
      line = line.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, (_, t) => chalk.italic(t));
      // Inline code
      line = line.replace(/`([^`]+)`/g, (_, t) => chalk.cyan(t));
      // Strikethrough
      line = line.replace(/~~(.+?)~~/g, (_, t) => chalk.strikethrough(t));

      return line;
    })
    .join('\n');
}

export function renderWelcome(): void {
  console.log();
  console.log(chalk.bold.green('  askapro') + chalk.dim(' — Ask a Pro. Expert Document Agent.'));
  console.log(chalk.dim('  85+ Expert Roles | Document Analysis | Professional Outputs'));
  console.log();
  console.log(chalk.dim('  Commands: /help, /roles, /docs, /export, /model, /copy, /clear'));
  console.log(chalk.dim('  Quit: Ctrl+C or /exit'));
  console.log();
  console.log(
    chalk.dim.italic(
      '  Note: AI-assisted analysis — does not replace professional consultation.\n'
    )
  );
}

export function renderRoleActivation(roleName: string): void {
  console.log(chalk.cyan(`  [${roleName} activated]`));
}

export function renderToolCall(toolName: string): void {
  process.stdout.write(chalk.dim(`  [Tool: ${toolName}] `));
}

export function renderToolResult(toolName: string, truncated: boolean): void {
  if (truncated) {
    console.log(chalk.dim('(truncated)'));
  } else {
    console.log(chalk.dim('OK'));
  }
}

export function renderError(message: string): void {
  console.error(chalk.red(`\n  Error: ${message}\n`));
}

export function renderInfo(message: string): void {
  console.log(chalk.blue(`  ${message}`));
}

export function renderPrompt(): string {
  return chalk.green('askapro') + chalk.dim(' > ');
}
