document.addEventListener('DOMContentLoaded', () => {
    // 获取元素
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    
    const colorPicker = document.getElementById('color-picker');
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    const presetSizes = document.getElementById('preset-sizes');
    const downloadBtn = document.getElementById('download-btn');
    const scaleValue = document.getElementById('scale-value');
    
    // 添加缩放功能变量
    let currentScale = 1;
    const previewWrapper = document.querySelector('.preview-wrapper');

    // 初始化
    function initCanvas() {
        // 设置画布尺寸
        updateCanvasSize();
        
        // 绘制初始背景色
        drawBackground();
        
        // 更新预览比例
        updateScaleInfo();
    }

    // 更新画布尺寸
    function updateCanvasSize() {
        const width = parseInt(widthInput.value) || 1920;
        const height = parseInt(heightInput.value) || 1080;
        
        // 限制画布最大尺寸，防止性能问题
        const maxSize = 5000;
        const limitedWidth = Math.min(width, maxSize);
        const limitedHeight = Math.min(height, maxSize);
        
        // 如果值被限制了，更新输入框
        if (limitedWidth !== width) widthInput.value = limitedWidth;
        if (limitedHeight !== height) heightInput.value = limitedHeight;
        
        // 更新画布尺寸
        canvas.width = limitedWidth;
        canvas.height = limitedHeight;
        
        // 自动计算合适的缩放比例
        calculateOptimalScale();
    }
    
    // 计算最佳缩放比例
    function calculateOptimalScale() {
        const previewContainer = document.querySelector('.preview-container');
        const containerWidth = previewContainer.clientWidth - 60; // 减去内边距
        const containerHeight = previewContainer.clientHeight - 60;
        
        const widthRatio = containerWidth / canvas.width;
        const heightRatio = containerHeight / canvas.height;
        
        // 选择较小的缩放比例，确保画布在容器内完全可见
        currentScale = Math.min(widthRatio, heightRatio, 1);
        
        // 应用缩放
        applyScale();
        
        // 更新比例显示
        updateScaleInfo();
    }
    
    // 应用缩放比例
    function applyScale() {
        canvas.style.transform = `scale(${currentScale})`;
    }
    
    // 更新比例信息显示
    function updateScaleInfo() {
        const percentage = Math.round(currentScale * 100);
        scaleValue.textContent = `${percentage}%`;
    }

    // 绘制背景色
    function drawBackground() {
        const color = colorPicker.value;
        
        // 清除画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 设置背景色
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 添加动画效果
        animateBackground();
    }
    
    // 背景动画效果
    function animateBackground() {
        canvas.style.opacity = '0';
        setTimeout(() => {
            canvas.style.opacity = '1';
        }, 10);
    }

    // 下载背景
    function downloadBackground() {
        // 创建临时链接
        const link = document.createElement('a');
        
        // 将画布内容转为图片 URL
        const dataUrl = canvas.toDataURL('image/png');
        link.href = dataUrl;
        
        // 设置文件名 (颜色代码_宽x高.png)
        const colorCode = colorPicker.value.substring(1); // 移除#
        const fileName = `背景_${colorCode}_${canvas.width}x${canvas.height}.png`;
        link.download = fileName;
        
        // 触发下载
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // 添加下载动画反馈
        animateDownloadButton();
    }
    
    // 下载按钮动画
    function animateDownloadButton() {
        downloadBtn.classList.add('downloading');
        setTimeout(() => {
            downloadBtn.classList.remove('downloading');
        }, 1500);
    }

    // 处理预设尺寸选择
    function handlePresetChange() {
        const preset = presetSizes.value;
        
        if (preset) {
            const [width, height] = preset.split('x').map(num => parseInt(num));
            widthInput.value = width;
            heightInput.value = height;
            
            // 更新画布
            updateCanvasSize();
            drawBackground();
        }
    }
    
    // 窗口调整大小时重新计算缩放比例
    window.addEventListener('resize', () => {
        calculateOptimalScale();
    });

    // 事件监听
    colorPicker.addEventListener('input', drawBackground);
    
    widthInput.addEventListener('change', () => {
        presetSizes.value = ''; // 切换为自定义尺寸
        updateCanvasSize();
        drawBackground();
    });
    
    heightInput.addEventListener('change', () => {
        presetSizes.value = ''; // 切换为自定义尺寸
        updateCanvasSize();
        drawBackground();
    });
    
    presetSizes.addEventListener('change', handlePresetChange);
    
    downloadBtn.addEventListener('click', downloadBackground);

    // 初始化应用
    initCanvas();
}); 