#!/usr/bin/env node

/**
 * Script to find hardcoded text in React/TypeScript components
 * and suggest translation keys for i18n
 */

const fs = require('fs');
const path = require('path');

// Patterns to identify hardcoded text
const HARDCODED_PATTERNS = [
  // JSX text content
  />\s*([A-Z][^<>{}]*[a-zA-Z])\s*</g,
  // String literals in JSX attributes (like placeholder, alt, title)
  /(placeholder|alt|title|aria-label)=["']([^"']+)["']/g,
  // Alert/console messages
  /(alert|console\.(log|error|warn))\s*\(\s*["']([^"']+)["']/g,
  // Button/link text
  /<(button|a)[^>]*>\s*([A-Z][^<>{}]*[a-zA-Z])\s*<\/(button|a)>/g,
  // Form labels
  /<label[^>]*>\s*([A-Z][^<>{}]*[a-zA-Z])\s*<\/label>/g,
  // Headings
  /<h[1-6][^>]*>\s*([A-Z][^<>{}]*[a-zA-Z])\s*<\/h[1-6]>/g,
  // Paragraph text
  /<p[^>]*>\s*([A-Z][^<>{}]*[a-zA-Z])\s*<\/p>/g
];

// Text that should NOT be translated (technical terms, proper nouns, etc.)
const IGNORE_PATTERNS = [
  /^(USD|MXN|API|URL|HTTP|HTTPS|JSON|XML|CSS|HTML|JS|TS|TSX|JSX)$/i,
  /^(React|Next\.js|Supabase|Stripe|WhatsApp|Meta|Google|Apple|Facebook)$/i,
  /^(CDMX|México|Mexico|Roma Norte|Polanco|Condesa)$/i,
  /^(GitHub|npm|yarn|Node\.js|Tailwind|TypeScript)$/i,
  /^\d+(\.\d+)?\s*(px|rem|em|%|vh|vw|ms|s)$/i, // CSS values
  /^#[0-9a-fA-F]{3,6}$/i, // Hex colors
  /^rgb\(|^rgba\(/i, // RGB colors
  /^https?:\/\//i, // URLs
  /^\/[a-zA-Z0-9\/_-]*$/i, // Paths
  /^[a-zA-Z0-9_-]+\.(png|jpg|jpeg|gif|svg|ico)$/i, // Image files
  /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,}$/i, // Emails
  /^\+?\d+[\s\-\(\)]*[\d\s\-\(\)]+$/i, // Phone numbers
  /^[A-Z0-9\-]{10,}$/i, // IDs, tokens, etc.
  /^lorem ipsum/i, // Placeholder text
  /^test|^mock|^demo|^example/i, // Test data
];

// Files to skip
const SKIP_PATTERNS = [
  /node_modules/,
  /\.git/,
  /\.next/,
  /build/,
  /dist/,
  /coverage/,
  /\.d\.ts$/,
  /\.test\./,
  /\.spec\./,
  /translations\.ts$/,
  /LocaleContext\.tsx$/,
  /EnhancedLocaleContext\.tsx$/
];

function shouldIgnoreText(text) {
  if (!text || text.length < 2) return true;
  if (/^\s*$/.test(text)) return true; // Whitespace only
  if (/^[^a-zA-Z]*$/.test(text)) return true; // No letters
  
  return IGNORE_PATTERNS.some(pattern => pattern.test(text.trim()));
}

function generateTranslationKey(text, context = '') {
  const cleaned = text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .substring(0, 50); // Limit length
  
  if (context) {
    return `${context}.${cleaned}`;
  }
  
  // Try to infer context from text content
  if (text.includes('Sign') || text.includes('Login') || text.includes('Register')) {
    return `auth.${cleaned}`;
  }
  if (text.includes('Book') || text.includes('Service') || text.includes('Reserve')) {
    return `booking.${cleaned}`;
  }
  if (text.includes('Professional') || text.includes('Pro')) {
    return `pro.${cleaned}`;
  }
  if (text.includes('Admin') || text.includes('Manage')) {
    return `admin.${cleaned}`;
  }
  if (text.includes('Error') || text.includes('Success') || text.includes('Loading')) {
    return `common.${cleaned}`;
  }
  
  return `ui.${cleaned}`;
}

function analyzeFile(filePath, content) {
  const findings = [];
  const lines = content.split('\n');
  
  HARDCODED_PATTERNS.forEach((pattern, patternIndex) => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const foundText = match[match.length - 1] || match[1]; // Get the captured text
      
      if (!shouldIgnoreText(foundText)) {
        // Find line number
        const beforeMatch = content.substring(0, match.index);
        const lineNumber = (beforeMatch.match(/\n/g) || []).length + 1;
        const line = lines[lineNumber - 1] || '';
        
        findings.push({
          file: filePath,
          line: lineNumber,
          text: foundText.trim(),
          context: line.trim(),
          suggestedKey: generateTranslationKey(foundText.trim()),
          pattern: patternIndex
        });
      }
    }
    
    // Reset regex lastIndex
    pattern.lastIndex = 0;
  });
  
  return findings;
}

function scanDirectory(dirPath, findings = []) {
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    
    if (SKIP_PATTERNS.some(pattern => pattern.test(fullPath))) {
      continue;
    }
    
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      scanDirectory(fullPath, findings);
    } else if (stat.isFile() && /\.(tsx?|jsx?)$/.test(fullPath)) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        const fileFindings = analyzeFile(fullPath, content);
        findings.push(...fileFindings);
      } catch (error) {
        console.error(`Error reading file ${fullPath}:`, error.message);
      }
    }
  }
  
  return findings;
}

function generateReport(findings) {
  console.log('\n🔍 HARDCODED TEXT ANALYSIS REPORT');
  console.log('=====================================\n');
  
  if (findings.length === 0) {
    console.log('✅ No hardcoded text found!');
    return;
  }
  
  console.log(`Found ${findings.length} potential hardcoded text instances:\n`);
  
  // Group by file
  const byFile = findings.reduce((acc, finding) => {
    if (!acc[finding.file]) acc[finding.file] = [];
    acc[finding.file].push(finding);
    return acc;
  }, {});
  
  Object.entries(byFile).forEach(([file, fileFindings]) => {
    console.log(`📄 ${file.replace(process.cwd(), '.')}`);
    console.log('─'.repeat(file.length + 2));
    
    fileFindings.forEach(finding => {
      console.log(`  Line ${finding.line}: "${finding.text}"`);
      console.log(`    Context: ${finding.context}`);
      console.log(`    Suggested: t('${finding.suggestedKey}')`);
      console.log('');
    });
  });
  
  // Summary by category
  console.log('\n📊 SUMMARY BY SUGGESTED CATEGORY');
  console.log('=====================================');
  
  const byCategory = findings.reduce((acc, finding) => {
    const category = finding.suggestedKey.split('.')[0];
    if (!acc[category]) acc[category] = 0;
    acc[category]++;
    return acc;
  }, {});
  
  Object.entries(byCategory)
    .sort(([,a], [,b]) => b - a)
    .forEach(([category, count]) => {
      console.log(`  ${category}: ${count} instances`);
    });
  
  console.log('\n💡 NEXT STEPS');
  console.log('==============');
  console.log('1. Review the findings above');
  console.log('2. Add missing translation keys to src/lib/i18n/translations.ts');
  console.log('3. Replace hardcoded text with t() function calls');
  console.log('4. Test language switching functionality');
  console.log('5. Run this script again to verify fixes\n');
}

// Main execution
function main() {
  const srcPath = path.join(process.cwd(), 'src');
  
  if (!fs.existsSync(srcPath)) {
    console.error('❌ src directory not found. Run this script from the project root.');
    process.exit(1);
  }
  
  console.log('🔍 Scanning for hardcoded text...');
  const findings = scanDirectory(srcPath);
  generateReport(findings);
}

if (require.main === module) {
  main();
}

module.exports = { analyzeFile, shouldIgnoreText, generateTranslationKey };