const fs = require('fs');
const path = require('path');

// 更保守的代码优化函数
function optimizeCode(code) {
  // 保存原始代码用于比较
  const originalCode = code;
  
  // 移除多行注释，但保留重要的注释
  code = code.replace(/\/\*[\s\S]*?\*\//g, '');
  
  // 移除单行注释，但保留URL中的//
  code = code.replace(/(?<!:)\/\/.*$/gm, '');
  
  // 移除多余的空行（连续的空行合并为一行）
  code = code.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  // 移除行首行尾的空白字符
  code = code.replace(/^[ \t]+|[ \t]+$/gm, '');
  
  // 移除多余的空格（但保持基本的可读性）
  code = code.replace(/  +/g, ' '); // 多个空格合并为一个
  
  // 移除分号前的空格
  code = code.replace(/ +;/g, ';');
  
  // 移除逗号后多余的空格（保留一个空格）
  code = code.replace(/, +/g, ', ');
  
  // 移除操作符周围多余的空格（但保留一个空格以保持可读性）
  code = code.replace(/ += +/g, ' = ');
  code = code.replace(/ +\+ +/g, ' + ');
  code = code.replace(/ +- +/g, ' - ');
  code = code.replace(/ +\* +/g, ' * ');
  code = code.replace(/ +\/ +/g, ' / ');
  
  // 移除括号内外多余的空格
  code = code.replace(/\( +/g, '(');
  code = code.replace(/ +\)/g, ')');
  code = code.replace(/\{ +/g, '{');
  code = code.replace(/ +\}/g, '}');
  code = code.replace(/\[ +/g, '[');
  code = code.replace(/ +\]/g, ']');
  
  // 移除首尾空白
  code = code.trim();
  
  // 如果优化后的代码太短或者看起来被破坏了，返回原始代码
  if (code.length < originalCode.length * 0.3 || code.length < 50) {
    console.log('   警告: 优化可能过度，保持原始代码');
    return originalCode;
  }
  
  return code;
}

// 获取所有需要优化的文件
function getAllFiles(dir, extensions = ['.js', '.ts']) {
  let files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // 跳过不需要处理的目录
      if (item !== 'node_modules' && item !== '.git' && item !== 'typings' && item !== 'scripts' && item !== 'miniprogram_npm') {
        files = files.concat(getAllFiles(fullPath, extensions));
      }
    } else if (extensions.some(ext => item.endsWith(ext))) {
      // 跳过类型定义文件和已经优化过的文件
      if (!item.endsWith('.d.ts') && !item.endsWith('.backup') && !item.endsWith('.optimized.js')) {
        files.push(fullPath);
      }
    }
  }
  
  return files;
}

// 优化单个文件
function optimizeFile(filePath) {
  try {
    const originalCode = fs.readFileSync(filePath, 'utf8');
    
    // 跳过空文件
    if (originalCode.trim().length === 0) {
      console.log(`⏭️ 跳过空文件: ${filePath}`);
      return;
    }
    
    // 跳过已经很小的文件（可能已经被优化过）
    if (originalCode.length < 100) {
      console.log(`⏭️ 跳过小文件: ${path.relative(process.cwd(), filePath)} (${originalCode.length} bytes)`);
      return;
    }
    
    // 优化代码
    const optimizedCode = optimizeCode(originalCode);
    
    // 计算压缩比例
    const originalSize = Buffer.byteLength(originalCode, 'utf8');
    const optimizedSize = Buffer.byteLength(optimizedCode, 'utf8');
    const savings = originalSize > 0 ? ((originalSize - optimizedSize) / originalSize * 100).toFixed(2) : 0;
    
    // 只有在有明显优化效果时才保存（至少节省5%且节省超过50字节）
    if (optimizedSize < originalSize && (originalSize - optimizedSize) > 50 && parseFloat(savings) > 5) {
      // 创建备份
      const backupPath = filePath + '.backup';
      if (!fs.existsSync(backupPath)) {
        fs.writeFileSync(backupPath, originalCode);
      }
      
      // 写入优化后的代码
      fs.writeFileSync(filePath, optimizedCode);
      
      console.log(`✅ ${path.relative(process.cwd(), filePath)}`);
      console.log(`   原始: ${originalSize} bytes → 优化: ${optimizedSize} bytes`);
      console.log(`   节省: ${savings}% (${originalSize - optimizedSize} bytes)\n`);
      
      return {
        originalSize,
        optimizedSize,
        savings: originalSize - optimizedSize
      };
    } else {
      console.log(`⏭️ 无需优化: ${path.relative(process.cwd(), filePath)} (节省不明显或文件太小)\n`);
      return null;
    }
    
  } catch (error) {
    console.error(`❌ 处理文件失败 ${filePath}:`, error.message);
    return null;
  }
}

// 主函数
function main() {
  console.log('🚀 开始保守的代码优化...\n');
  
  const projectRoot = process.cwd();
  const files = getAllFiles(projectRoot, ['.js', '.ts']);
  
  console.log(`📁 找到 ${files.length} 个文件需要检查\n`);
  
  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  let totalSavings = 0;
  let optimizedCount = 0;
  
  for (const file of files) {
    const result = optimizeFile(file);
    if (result) {
      totalOriginalSize += result.originalSize;
      totalOptimizedSize += result.optimizedSize;
      totalSavings += result.savings;
      optimizedCount++;
    }
  }
  
  console.log('📊 优化统计:');
  console.log(`   检查文件: ${files.length} 个`);
  console.log(`   优化文件: ${optimizedCount} 个`);
  
  if (totalOriginalSize > 0) {
    const totalSavingsPercent = ((totalSavings / totalOriginalSize) * 100).toFixed(2);
    console.log(`   总大小: ${totalOriginalSize} → ${totalOptimizedSize} bytes`);
    console.log(`   总节省: ${totalSavings} bytes (${totalSavingsPercent}%)`);
  }
  
  console.log('\n🎉 保守优化完成！');
  console.log('💡 提示: 原始文件已备份为 .backup 文件');
  console.log('💡 使用 --restore 参数可以恢复原始文件');
  console.log('⚠️  注意: 此次优化更加保守，确保代码功能不受影响');
}

// 恢复备份文件
function restoreBackups() {
  console.log('🔄 开始恢复备份文件...\n');
  
  const projectRoot = process.cwd();
  const backupFiles = getAllFiles(projectRoot, ['.backup']);
  
  let restoredCount = 0;
  
  for (const backupFile of backupFiles) {
    const originalFile = backupFile.replace('.backup', '');
    if (fs.existsSync(originalFile)) {
      const backupContent = fs.readFileSync(backupFile, 'utf8');
      fs.writeFileSync(originalFile, backupContent);
      fs.unlinkSync(backupFile); // 删除备份文件
      
      console.log(`✅ 恢复: ${path.relative(projectRoot, originalFile)}`);
      restoredCount++;
    }
  }
  
  console.log(`\n🎉 恢复完成！共恢复 ${restoredCount} 个文件`);
}

// 清理备份文件
function cleanBackups() {
  console.log('🧹 开始清理备份文件...\n');
  
  const projectRoot = process.cwd();
  const backupFiles = getAllFiles(projectRoot, ['.backup']);
  
  let cleanedCount = 0;
  
  for (const backupFile of backupFiles) {
    fs.unlinkSync(backupFile);
    console.log(`🗑️ 删除备份: ${path.relative(projectRoot, backupFile)}`);
    cleanedCount++;
  }
  
  console.log(`\n🎉 清理完成！共删除 ${cleanedCount} 个备份文件`);
}

// 命令行参数处理
const args = process.argv.slice(2);
if (args.includes('--restore')) {
  restoreBackups();
} else if (args.includes('--clean-backups')) {
  cleanBackups();
} else {
  main();
} 