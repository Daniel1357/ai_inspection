// AI巡检系统 - 主交互逻辑

// 页面导航
function navigateTo(pageName) {
  // 隐藏所有页面
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  
  // 显示目标页面
  const targetPage = document.getElementById(`page-${pageName}`);
  if (targetPage) {
    targetPage.classList.add('active');
  }
  
  // 更新导航链接状态
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.dataset.page === pageName) {
      link.classList.add('active');
    }
  });
  
  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 绑定导航链接点击事件
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const pageName = link.dataset.page;
    navigateTo(pageName);
  });
});

// 上传区域交互
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const aiMessages = document.getElementById('aiMessages');

if (uploadArea && fileInput) {
  uploadArea.addEventListener('click', () => {
    fileInput.click();
  });
  
  // 拖拽上传
  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = 'var(--accent-primary)';
    uploadArea.style.background = 'var(--color-gray-50)';
  });
  
  uploadArea.addEventListener('dragleave', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = 'var(--color-gray-300)';
    uploadArea.style.background = 'var(--color-white)';
  });
  
  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = 'var(--color-gray-300)';
    uploadArea.style.background = 'var(--color-white)';
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  });
  
  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
  });
}

// 处理文件上传
function handleFileUpload(file) {
  // 显示上传中状态
  uploadArea.innerHTML = `
    <div class="upload-content">
      <div class="upload-icon uploading">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      </div>
      <p class="upload-text">正在分析图片...</p>
      <p class="upload-hint">${file.name}</p>
    </div>
  `;
  
  // 模拟AI分析过程
  setTimeout(() => {
    showAnalysisResult(file);
  }, 2000);
}

// 显示分析结果
function showAnalysisResult(file) {
  // 更新上传区域显示图片预览
  const reader = new FileReader();
  reader.onload = (e) => {
    uploadArea.innerHTML = `
      <div class="upload-preview">
        <img src="${e.target.result}" alt="上传的图片" style="max-width: 100%; max-height: 200px; border-radius: 8px;">
        <p class="upload-text" style="margin-top: 12px; color: var(--color-success);">✓ 图片已上传</p>
      </div>
    `;
  };
  reader.readAsDataURL(file);
  
  // 添加AI分析消息
  const resultMessage = document.createElement('div');
  resultMessage.className = 'ai-message ai-result';
  resultMessage.innerHTML = `
    <p style="margin-bottom: 12px;"><strong>分析完成！</strong> 检测到以下内容：</p>
    <div class="result-item" style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; padding: 8px; background: rgba(42, 157, 143, 0.1); border-radius: 6px;">
      <span style="color: var(--color-success); font-weight: 600;">✓</span>
      <span>封条完好无损</span>
    </div>
    <div class="result-item" style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; padding: 8px; background: rgba(42, 157, 143, 0.1); border-radius: 6px;">
      <span style="color: var(--color-success); font-weight: 600;">✓</span>
      <span>压力表指针在绿区 (1.2MPa)</span>
    </div>
    <div class="result-item" style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; padding: 8px; background: rgba(244, 162, 97, 0.1); border-radius: 6px;">
      <span style="color: var(--accent-orange); font-weight: 600;">⚠</span>
      <span>水带卷放略有松散，建议整理</span>
    </div>
    <p style="margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--color-gray-200); font-size: 0.85rem; color: var(--color-gray-600);">
      总体评估：<strong style="color: var(--color-success);">基本合格</strong>，有1项需要改进
    </p>
  `;
  
  aiMessages.appendChild(resultMessage);
  aiMessages.scrollTop = aiMessages.scrollHeight;
  
  // 更新检查项状态
  updateChecklistItems();
  
  // 更新进度
  updateProgress();
}

// 更新检查列表状态
function updateChecklistItems() {
  const checkItems = document.querySelectorAll('.check-item');
  checkItems.forEach((item, index) => {
    const icon = item.querySelector('.check-icon');
    if (index < 2) {
      icon.textContent = '✓';
      icon.style.background = 'var(--color-success)';
      icon.style.color = 'white';
      icon.style.borderColor = 'var(--color-success)';
    } else {
      icon.textContent = '!';
      icon.style.background = 'var(--accent-orange)';
      icon.style.color = 'white';
      icon.style.borderColor = 'var(--accent-orange)';
    }
  });
}

// 更新进度条
function updateProgress() {
  const progressFill = document.querySelector('.progress-fill');
  const progressText = document.querySelector('.progress-text');
  if (progressFill && progressText) {
    progressFill.style.width = '66%';
    progressText.textContent = '2 / 3 项已完成';
  }
  
  // 更新导航点
  const navDots = document.querySelectorAll('.nav-dot');
  if (navDots[1]) {
    navDots[1].classList.remove('active');
    navDots[1].classList.add('completed');
  }
  if (navDots[2]) {
    navDots[2].classList.add('active');
  }
}

// 筛选按钮交互
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// 日期选择器交互
document.querySelectorAll('.date-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.date-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// 添加一些动画效果
document.addEventListener('DOMContentLoaded', () => {
  // 统计数字动画
  const statNumbers = document.querySelectorAll('.stat-number');
  statNumbers.forEach(stat => {
    const text = stat.textContent;
    const number = parseFloat(text);
    if (!isNaN(number)) {
      animateNumber(stat, 0, number, 1500);
    }
  });
});

// 数字动画函数
function animateNumber(element, start, end, duration) {
  const startTime = performance.now();
  const originalText = element.textContent;
  const hasUnit = originalText.includes('%') || originalText.includes('秒');
  const unit = hasUnit ? originalText.replace(/[\d.]/g, '').trim() : '';
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // 使用缓动函数
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const current = start + (end - start) * easeOutQuart;
    
    if (Number.isInteger(end)) {
      element.innerHTML = Math.round(current) + (unit ? `<span class="stat-unit">${unit}</span>` : '');
    } else {
      element.innerHTML = current.toFixed(1) + (unit ? `<span class="stat-unit">${unit}</span>` : '');
    }
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}

// 将navigateTo函数暴露到全局
window.navigateTo = navigateTo;

// 添加键盘快捷键
document.addEventListener('keydown', (e) => {
  // 按1-4数字键快速切换页面
  if (e.key >= '1' && e.key <= '4' && !e.ctrlKey && !e.altKey && !e.metaKey) {
    const pages = ['home', 'tasks', 'inspect', 'dashboard'];
    const pageIndex = parseInt(e.key) - 1;
    if (pages[pageIndex]) {
      navigateTo(pages[pageIndex]);
    }
  }
});

console.log('🚀 AI巡检系统已启动');
console.log('💡 提示：按数字键 1-4 可快速切换页面');
