# Leaflet测量组件

这是一个基于Leaflet和Leaflet-Geoman的地图面积测量组件，提供多边形绘制、面积计算、单位切换和删除功能。该组件将所有功能封装成API方法，不依赖UI按钮，可以通过代码指令触发。

## 功能特点

- 支持多边形和矩形绘制测量
- 自动计算并显示面积
- 支持多种面积单位（千米、英里、海里）切换
- 每个测量图形带有删除按钮
- 支持同时显示多个测量图形
- 完全通过API控制，无需UI按钮

## 使用方法

### 引入依赖

```html
<link rel="stylesheet" href="./dist/leaflet.css" />
<link rel="stylesheet" href="./dist/leaflet-geoman.css" />

<script src="./dist/leaflet.js"></script>
<script src="./dist/leaflet-geoman.min.js"></script>
<script src="./dist/leaflet.draw.js"></script>
<script src="./leaflet-measure.js"></script>
```

### 初始化组件

```javascript
// 初始化地图
const map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// 初始化测量组件
const measureTool = new LeafletMeasure(map, {
  // 可选配置
  polygonOptions: {
    snappable: true,
    templineStyle: {
      color: 'blue'
    }
  }
});

// 添加样式
measureTool.addStyles();
```

## API方法

### 开始绘制测量

```javascript
// 开始绘制多边形
measureTool.startDraw('Polygon');

// 开始绘制矩形
measureTool.startDraw('Rectangle');
```

### 停止绘制

```javascript
measureTool.stopDraw();
```

### 切换面积单位

```javascript
// 切换单位并返回当前单位
const currentUnit = measureTool.switchUnit();
```

### 获取当前单位

```javascript
const unit = measureTool.getCurrentUnit();
```

### 清除所有测量

```javascript
measureTool.clearAll();
```

### 获取测量结果

```javascript
const measurements = measureTool.getMeasurements();
console.log(measurements);
```

## 配置选项

在初始化时可以传入以下配置选项：

```javascript
const measureTool = new LeafletMeasure(map, {
  // 控件位置
  position: 'topleft',
  
  // 绘图工具控制
  drawPolygon: true,
  drawRectangle: true,
  drawMarker: false,
  drawCircle: false,
  drawPolyline: false,
  
  // 编辑模式控制
  editMode: false,
  dragMode: false,
  cutPolygon: false,
  removalMode: false,
  
  // 语言设置
  language: 'zh',
  
  // 多边形绘制选项
  polygonOptions: {
    snappable: true,
    templineStyle: {
      color: 'red'
    }
  }
});
```

## 示例

查看 `leaflet-measure-demo.html` 文件获取完整使用示例。