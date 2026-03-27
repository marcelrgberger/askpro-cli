import chalk from 'chalk';
import { MODELS, listModels } from '../llm/models.js';
import type { Conversation } from '../agent/conversation.js';

export interface CommandContext {
  conversation: Conversation;
  setModel: (model: string) => void;
  setRole: (role: string | null) => void;
}

export function handleCommand(input: string, ctx: CommandContext): boolean {
  const trimmed = input.trim();
  if (!trimmed.startsWith('/')) return false;

  const parts = trimmed.slice(1).split(/\s+/);
  const cmd = parts[0]?.toLowerCase();
  const args = parts.slice(1);

  switch (cmd) {
    case 'help':
      showHelp();
      return true;

    case 'roles':
      showRoles();
      return true;

    case 'role':
      if (args[0]) {
        ctx.setRole(args[0]);
        console.log(chalk.cyan(`  Rolle aktiviert: ${args[0]}`));
      } else {
        ctx.setRole(null);
        console.log(chalk.cyan('  Rolle deaktiviert — automatisches Routing aktiv'));
      }
      return true;

    case 'model':
      if (args[0]) {
        if (MODELS[args[0]]) {
          ctx.setModel(args[0]);
          console.log(chalk.cyan(`  Model switched: ${MODELS[args[0]].name}`));
          console.log(chalk.dim('  Saved as default for future sessions.'));
        } else {
          console.log(chalk.red(`  Unknown model: ${args[0]}`));
          console.log(chalk.dim(`  Available:`));
          for (const m of listModels()) {
            console.log(chalk.dim(`    ${m.id} — ${m.name}`));
          }
        }
      } else {
        console.log();
        console.log(chalk.bold('  Available models:'));
        console.log();
        const current = ctx.conversation.model;
        for (let i = 0; i < listModels().length; i++) {
          const m = listModels()[i];
          const isCurrent = m.id === current;
          const marker = isCurrent ? chalk.green(' <-- active') : '';
          const name = isCurrent ? chalk.bold(m.name) : m.name;
          console.log(`  ${i + 1}. ${m.id} — ${name} (${(m.contextWindow / 1000).toFixed(0)}K)${marker}`);
        }
        console.log();
        console.log(chalk.dim('  Usage: /model <name>   e.g. /model gpt-4.1'));
        console.log(chalk.dim('  Tip: Set per project in OPENAI.md: "- model: gpt-4.1-mini"'));
        console.log();
      }
      return true;

    case 'clear':
      ctx.conversation.clear();
      console.log(chalk.cyan('  Konversation geloescht'));
      return true;

    case 'exit':
    case 'quit':
      console.log(chalk.dim('\n  Auf Wiedersehen!\n'));
      process.exit(0);

    default:
      console.log(chalk.yellow(`  Unbekannter Befehl: /${cmd}`));
      console.log(chalk.dim('  Tippe /help fuer eine Liste aller Befehle'));
      return true;
  }
}

function showHelp(): void {
  console.log();
  console.log(chalk.bold('  Befehle:'));
  console.log();
  console.log('  /help               Diese Hilfe anzeigen');
  console.log('  /roles              Alle verfuegbaren Experten-Rollen auflisten');
  console.log('  /role <id>          Bestimmte Rolle manuell aktivieren');
  console.log('  /role               Automatisches Routing aktivieren');
  console.log('  /model <name>       Modell wechseln');
  console.log('  /model              Aktuelles Modell und Alternativen anzeigen');
  console.log('  /clear              Konversation loeschen');
  console.log('  /exit               Beenden');
  console.log();
  console.log(chalk.dim('  Geplant: /docs, /export, /panel, /memory, /compact'));
  console.log();
}

function showRoles(): void {
  console.log();
  console.log(chalk.bold('  Experten-Rollen (65):'));
  console.log();

  const categories = [
    { name: 'Recht', roles: 'fachanwalt-arbeitsrecht, fachanwalt-familienrecht, fachanwalt-mietrecht, fachanwalt-verkehrsrecht, fachanwalt-erbrecht, fachanwalt-strafrecht, fachanwalt-medizinrecht, fachanwalt-sozialrecht, fachanwalt-verwaltungsrecht, fachanwalt-it-recht, fachanwalt-handelsrecht, fachanwalt-insolvenzrecht, fachanwalt-baurecht, fachanwalt-versicherungsrecht, fachanwalt-steuerrecht' },
    { name: 'Steuern & Finanzen', roles: 'steuerberater, finanzberater, wirtschaftspruefer, buchhalter, lohnabrechner, controller, foerdermittelberater, zollberater' },
    { name: 'Medizin', roles: 'allgemeinmediziner, kardiologe, orthopaedie, neurologe, dermatologe, zahnarzt, psychologe, apotheker, ernaehrungsberater, medizincontroller' },
    { name: 'Immobilien & Bau', roles: 'architekt, immobilienbewerter, immobilienmakler, bauingenieur, energieberater, hausverwalter' },
    { name: 'Versicherung', roles: 'versicherungsberater, rentenberater, bu-berater, kv-berater' },
    { name: 'Unternehmen', roles: 'unternehmensberater, gruendungsberater, hr-berater, datenschutzbeauftragter, compliance-officer, patentberater' },
    { name: 'Wissenschaft', roles: 'lektor, statistiker, fachuebersetzer, paedagoge' },
    { name: 'Technik', roles: 'kfz-sachverstaendiger, elektroingenieur, umweltgutachter, it-sachverstaendiger' },
    { name: 'Verbraucher', roles: 'verbraucherschutz, schuldnerberater, reiserecht, behoerdenlotse, mediator' },
  ];

  for (const cat of categories) {
    console.log(chalk.cyan(`  ${cat.name}:`));
    console.log(chalk.dim(`    ${cat.roles}`));
    console.log();
  }

  console.log(chalk.dim('  Verwendung: /role <id>   z.B. /role steuerberater'));
  console.log();
}
