# Leaflet测量组件

这是一个基于Leaflet和Leaflet-Geoman的地图面积测量组件，提供多边形、矩形和圆形的绘制、面积计算、单位切换和删除功能。该组件将所有功能封装成API方法，不依赖UI按钮，可以通过代码指令触发。

## 功能特点

- 支持多边形、矩形和圆形绘制测量
- 自动计算并显示面积
- 支持多种面积单位（千米、英里、海里）切换
- 每个测量图形带有删除按钮
- 支持同时显示多个测量图形
- 完全通过API控制，无需UI按钮
- 支持图形绘制时的吸附功能

## 查看演示地址
[查看演示](https://lukesupercoder.github.io/leaflet-measure-area/measure-area-demo.html)

## 使用方法

### 引入依赖

```html
<link rel="stylesheet" href="./lib/leaflet.css" />
<link rel="stylesheet" href="./lib/leaflet-geoman.css" />

<script src="./lib/leaflet.js"></script>
<script src="./lib/leaflet-geoman.min.js"></script>
<script src="./lib/leaflet.draw.js"></script>
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
const measureTool = new L.measureArea(map, {
  // 可选配置
  polygonOptions: {
    snappable: true,    // 启用吸附功能
    templineStyle: {
      color: '#3288FF'  // 临时线条颜色
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

// 开始绘制圆形
measureTool.startDraw('Circle');
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
const measureTool = new L.measureArea(map, {
  polygonOptions: {
    snappable: true,      // 是否启用吸附功能
    templineStyle: {      // 绘制时临时线条样式
      color: '#3288FF'    // 线条颜色
    }
  }
});
```

## 注意事项

- 确保所有依赖文件都正确引入
- 在开始新的绘制前，建议先调用stopDraw()停止当前绘制
- 切换图形类型时会自动停止当前绘制
- 面积单位切换会影响所有已绘制图形的显示

## 示例

查看 `leaflet-measure-demo.html` 文件获取完整使用示例。该示例展示了如何创建一个完整的测量工具，包括多边形、矩形和圆形的绘制，以及单位切换、清除等功能的实现。