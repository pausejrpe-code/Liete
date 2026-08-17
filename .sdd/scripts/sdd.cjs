#!/usr/bin/env node

/**
 * SDD CLI — Spec-Driven Development Toolkit for Liete Platform
 * Deterministic, zero-external-dependency Node.js CLI tool.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..', '..');
const SPEC_DIR = path.join(ROOT_DIR, '.spec');
const SDD_DIR = path.join(ROOT_DIR, '.sdd');
const AGENTS_DIR = path.join(ROOT_DIR, '.agents');

function printHeader() {
  console.log('\x1b[36m====================================================\x1b[0m');
  console.log('\x1b[1m\x1b[32m  SPEC-DRIVEN DEVELOPMENT (SDD) — CLI TOOLKIT\x1b[0m');
  console.log('\x1b[36m====================================================\x1b[0m');
}

function loadConfig() {
  const configPath = path.join(SDD_DIR, 'config.json');
  if (fs.existsSync(configPath)) {
    try {
      return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } catch (e) {
      return {};
    }
  }
  return {};
}

function getDirectories(srcPath) {
  if (!fs.existsSync(srcPath)) return [];
  return fs.readdirSync(srcPath).filter(file => {
    return fs.statSync(path.join(srcPath, file)).isDirectory();
  });
}

function getFiles(srcPath) {
  if (!fs.existsSync(srcPath)) return [];
  return fs.readdirSync(srcPath).filter(file => {
    return fs.statSync(path.join(srcPath, file)).isFile();
  });
}

function cmdStatus() {
  printHeader();
  console.log('\n\x1b[1m[+] STATUS GERAL DO SDD\x1b[0m');

  const baselineFiles = getFiles(path.join(SPEC_DIR, 'baseline')).filter(f => f.endsWith('.md'));
  const featureDirs = getDirectories(path.join(SPEC_DIR, 'features'));
  const changeDirs = getDirectories(path.join(SPEC_DIR, 'changes'));
  const bugDirs = getDirectories(path.join(SPEC_DIR, 'bugs'));
  const refactorDirs = getDirectories(path.join(SPEC_DIR, 'refactors'));
  const decisions = getFiles(path.join(SPEC_DIR, 'decisions')).filter(f => f.endsWith('.md') && !f.startsWith('.'));

  console.log(`\n  * Baseline Mapeado:        \x1b[32m${baselineFiles.length} documentos\x1b[0m (product, architecture, feature-map, integrations, data-map, technical-debt)`);
  console.log(`  * Features SDD Ativas:     \x1b[33m${featureDirs.length}\x1b[0m`);
  console.log(`  * Mudanças (Changes):      \x1b[33m${changeDirs.length}\x1b[0m`);
  console.log(`  * Defeitos (Bugs):         \x1b[33m${bugDirs.length}\x1b[0m`);
  console.log(`  * Refatorações:            \x1b[33m${refactorDirs.length}\x1b[0m`);
  console.log(`  * Decisões (ADRs):         \x1b[32m${decisions.length}\x1b[0m`);

  // Count baseline features in feature-map.md
  const featureMapPath = path.join(SPEC_DIR, 'baseline', 'feature-map.md');
  let legacyCount = 0;
  if (fs.existsSync(featureMapPath)) {
    const content = fs.readFileSync(featureMapPath, 'utf8');
    const matches = content.match(/### FEAT-LEG-\d{3}:/g);
    if (matches) legacyCount = matches.length;
  }
  console.log(`  * Features Legacy Baseline: \x1b[36m${legacyCount} mapeadas\x1b[0m`);

  console.log('\n\x1b[32m[OK] Ecossistema SDD ativo e governando o repositório.\x1b[0m\n');
}

function cmdFeatureList() {
  printHeader();
  console.log('\n\x1b[1m[+] LISTA DE FEATURES MAPEADAS\x1b[0m\n');

  // Baseline Legacy Features
  const featureMapPath = path.join(SPEC_DIR, 'baseline', 'feature-map.md');
  if (fs.existsSync(featureMapPath)) {
    console.log('\x1b[1m--- LEGACY BASELINE FEATURES ---\x1b[0m');
    const content = fs.readFileSync(featureMapPath, 'utf8');
    const lines = content.split('\n');
    lines.forEach(line => {
      if (line.startsWith('### FEAT-LEG-')) {
        console.log(`  \x1b[36m${line.replace('### ', '')}\x1b[0m`);
      }
    });
  }

  // Active SDD Features
  const featuresPath = path.join(SPEC_DIR, 'features');
  const featureDirs = getDirectories(featuresPath);
  console.log('\n\x1b[1m--- ACTIVE SDD FEATURES ---\x1b[0m');
  if (featureDirs.length === 0) {
    console.log('  \x1b[90m(Nenhuma nova feature SDD criada ainda. Use /spec new para iniciar uma nova feature)\x1b[0m');
  } else {
    featureDirs.forEach(dir => {
      console.log(`  * \x1b[32m${dir}\x1b[0m`);
    });
  }
  console.log('');
}

function cmdFeatureShow(id) {
  printHeader();
  if (!id) {
    console.log('\x1b[31m[ERRO] Especifique o ID da feature (ex: sdd feature show FEAT-001 ou FEAT-LEG-001)\x1b[0m');
    return;
  }

  console.log(`\n\x1b[1m[+] DETALHES DA FEATURE: ${id}\x1b[0m\n`);

  if (id.startsWith('FEAT-LEG-')) {
    const featureMapPath = path.join(SPEC_DIR, 'baseline', 'feature-map.md');
    if (fs.existsSync(featureMapPath)) {
      const content = fs.readFileSync(featureMapPath, 'utf8');
      const parts = content.split(`### ${id}:`);
      if (parts.length > 1) {
        const section = parts[1].split('### FEAT-LEG-')[0].split('---')[0];
        console.log(`\x1b[36m### ${id}:${section}\x1b[0m`);
        return;
      }
    }
    console.log(`\x1b[33mFeature ${id} não encontrada no baseline.\x1b[0m`);
    return;
  }

  // Search in .spec/features/
  const featuresPath = path.join(SPEC_DIR, 'features');
  const targetDir = getDirectories(featuresPath).find(d => d.startsWith(id));
  if (!targetDir) {
    console.log(`\x1b[31m[ERRO] Diretório da feature ${id} não encontrado em .spec/features/\x1b[0m`);
    return;
  }

  const featDir = path.join(featuresPath, targetDir);
  const files = getFiles(featDir);
  console.log(`Diretório: ${featDir}`);
  console.log(`Arquivos encontrados: ${files.join(', ')}`);

  const statusPath = path.join(featDir, 'status.md');
  if (fs.existsSync(statusPath)) {
    console.log('\n--- CONTEÚDO DO STATUS.MD ---');
    console.log(fs.readFileSync(statusPath, 'utf8'));
  }
}

function cmdVerify(id) {
  printHeader();
  if (!id) {
    console.log('\x1b[31m[ERRO] Especifique o ID para verificação (ex: sdd verify FEAT-001)\x1b[0m');
    return;
  }

  console.log(`\n\x1b[1m[+] VERIFICANDO CONFORMIDADE: ${id}\x1b[0m\n`);

  const featuresPath = path.join(SPEC_DIR, 'features');
  const targetDir = getDirectories(featuresPath).find(d => d.startsWith(id));
  if (!targetDir) {
    console.log(`\x1b[31m[ERRO] Especificação ${id} não encontrada.\x1b[0m`);
    return;
  }

  const featDir = path.join(featuresPath, targetDir);
  const reqPath = path.join(featDir, 'requirements.md');
  const accPath = path.join(featDir, 'acceptance.md');
  const taskPath = path.join(featDir, 'tasks.md');
  const verPath = path.join(featDir, 'verification.md');

  const checks = [
    { name: 'requirements.md presente', pass: fs.existsSync(reqPath) },
    { name: 'acceptance.md presente', pass: fs.existsSync(accPath) },
    { name: 'tasks.md presente', pass: fs.existsSync(taskPath) },
    { name: 'verification.md presente', pass: fs.existsSync(verPath) }
  ];

  checks.forEach(c => {
    console.log(`  [${c.pass ? '\x1b[32mPASS\x1b[0m' : '\x1b[31mFAIL\x1b[0m'}] ${c.name}`);
  });

  const allPassed = checks.every(c => c.pass);
  console.log(`\nResultado da Auditoria: ${allPassed ? '\x1b[32mCONFORME COM SDD\x1b[0m' : '\x1b[33mINCOMPLETO / PENDENTE\x1b[0m'}\n`);
}

function cmdMatrix(id) {
  printHeader();
  console.log(`\n\x1b[1m[+] MATRIZ DE RASTREABILIDADE: ${id || 'GERAL'}\x1b[0m\n`);

  if (!id) {
    console.log('Especifique o ID da feature para gerar a matriz ponta a ponta.');
    return;
  }

  const featuresPath = path.join(SPEC_DIR, 'features');
  const targetDir = getDirectories(featuresPath).find(d => d.startsWith(id));
  if (!targetDir) {
    console.log(`\x1b[31m[ERRO] Feature ${id} não encontrada.\x1b[0m`);
    return;
  }

  const featDir = path.join(featuresPath, targetDir);
  const verPath = path.join(featDir, 'verification.md');
  if (fs.existsSync(verPath)) {
    console.log(fs.readFileSync(verPath, 'utf8'));
  } else {
    console.log(`\x1b[33mArquivo verification.md ainda não foi gerado para ${id}. Execute /verify ${id}\x1b[0m`);
  }
}

function cmdDoctor() {
  printHeader();
  console.log('\n\x1b[1m[+] DIAGNÓSTICO DO ECOSSISTEMA SDD (sdd doctor)\x1b[0m\n');

  const items = [
    { label: 'Diretório de Regras (.agents/rules/)', path: path.join(AGENTS_DIR, 'rules'), isDir: true },
    { label: 'Regra Mestre (sdd-core.md)', path: path.join(AGENTS_DIR, 'rules', 'sdd-core.md') },
    { label: 'Regra de Arquitetura (architecture-guard.md)', path: path.join(AGENTS_DIR, 'rules', 'architecture-guard.md') },
    { label: 'Regra de Segurança (security.md)', path: path.join(AGENTS_DIR, 'rules', 'security.md') },
    { label: 'Regra de Contexto (context-policy.md)', path: path.join(AGENTS_DIR, 'rules', 'context-policy.md') },
    { label: 'Skill spec-writer', path: path.join(AGENTS_DIR, 'skills', 'spec-writer', 'SKILL.md') },
    { label: 'Skill architect', path: path.join(AGENTS_DIR, 'skills', 'architect', 'SKILL.md') },
    { label: 'Skill developer', path: path.join(AGENTS_DIR, 'skills', 'developer', 'SKILL.md') },
    { label: 'Skill tester', path: path.join(AGENTS_DIR, 'skills', 'tester', 'SKILL.md') },
    { label: 'Skill reviewer', path: path.join(AGENTS_DIR, 'skills', 'reviewer', 'SKILL.md') },
    { label: 'Constituição (.spec/constitution.md)', path: path.join(SPEC_DIR, 'constitution.md') },
    { label: 'Baseline de Produto (.spec/baseline/product-map.md)', path: path.join(SPEC_DIR, 'baseline', 'product-map.md') },
    { label: 'Baseline de Arquitetura (.spec/baseline/architecture-map.md)', path: path.join(SPEC_DIR, 'baseline', 'architecture-map.md') },
    { label: 'Baseline de Features (.spec/baseline/feature-map.md)', path: path.join(SPEC_DIR, 'baseline', 'feature-map.md') },
    { label: 'Baseline de Integrações (.spec/baseline/integrations.md)', path: path.join(SPEC_DIR, 'baseline', 'integrations.md') },
    { label: 'Baseline de Dados (.spec/baseline/data-map.md)', path: path.join(SPEC_DIR, 'baseline', 'data-map.md') },
    { label: 'Baseline de Débito Técnico (.spec/baseline/technical-debt.md)', path: path.join(SPEC_DIR, 'baseline', 'technical-debt.md') },
    { label: 'Configuração SDD (.sdd/config.json)', path: path.join(SDD_DIR, 'config.json') },
    { label: 'Templates de Especificação (.sdd/templates/)', path: path.join(SDD_DIR, 'templates'), isDir: true }
  ];

  let errors = 0;
  items.forEach(item => {
    const exists = fs.existsSync(item.path);
    if (exists) {
      console.log(`  \x1b[32m[PASS]\x1b[0m ${item.label}`);
    } else {
      console.log(`  \x1b[31m[FAIL]\x1b[0m ${item.label} (Não encontrado: ${item.path})`);
      errors++;
    }
  });

  console.log('\n----------------------------------------------------');
  if (errors === 0) {
    console.log('\x1b[32m[SUCESSO] Todos os componentes do SDD estão íntegros e operacionais.\x1b[0m\n');
  } else {
    console.log(`\x1b[31m[ALERTA] ${errors} item(ns) apresentaram problemas.\x1b[0m\n`);
  }
}

function cmdInit() {
  printHeader();
  console.log('\n\x1b[1m[+] INICIALIZAÇÃO E RELATÓRIO DO SDD\x1b[0m\n');
  cmdDoctor();
  cmdStatus();
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'status';

  switch (command) {
    case 'status':
      cmdStatus();
      break;
    case 'feature':
      if (args[1] === 'list') {
        cmdFeatureList();
      } else if (args[1] === 'show') {
        cmdFeatureShow(args[2]);
      } else {
        console.log('Uso: sdd feature list | sdd feature show <id>');
      }
      break;
    case 'verify':
      cmdVerify(args[1]);
      break;
    case 'matrix':
      cmdMatrix(args[1]);
      break;
    case 'doctor':
      cmdDoctor();
      break;
    case 'init':
      cmdInit();
      break;
    default:
      console.log(`Comando desconhecido: ${command}`);
      console.log('Comandos disponíveis: status, feature list, feature show <id>, verify <id>, matrix <id>, doctor, init');
  }
}

main();
