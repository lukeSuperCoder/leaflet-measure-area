# 基于Leaflet的地图测量神器：轻松实现多边形面积计算与图层管理

> 在地图应用开发中，面积测量是一个常见需求。本文将介绍一个基于Leaflet和Geoman二次开发的地图测量组件，它不仅继承了Geoman的强大功能，还解决了Geoman不支持多测量图层管理的痛点，让你的地图测量体验更上一层楼。

## 🔥 在线演示

[点击查看在线演示](https://lukesupercoder.github.io/leaflet-measure-area/measure-area-demo.html)

[GitHub仓库地址](https://github.com/lukesupercoder/leaflet-measure-area)

## 🚀 功能特点

- 🎯 支持多边形、矩形和圆形绘制测量
- 📐 自动计算并实时显示面积
- 🔄 支持多种面积单位（千米、英里、海里）切换
- ❌ **每个测量图形带有独立删除按钮**（Geoman不支持）
- 📦 **支持同时显示和管理多个测量图层**（Geoman不支持）
- 🎮 完全通过API控制，无需UI按钮
- 🔗 支持图形绘制时的吸附功能

## 🔍 为什么选择leaflet-measure-area？

Geoman.js已经是Leaflet生态中非常强大的绘图工具，那为什么还需要leaflet-measure-area呢？

**核心差异：多测量图层管理能力**

- **Geoman的局限**：Geoman虽然提供了丰富的绘图功能，但不支持对多个测量图层的精细化管理，尤其是无法为每个图层添加独立的删除控件。

- **leaflet-measure-area的突破**：在Geoman的基础上，我们实现了多测量图层的管理功能，每个图层都有独立的删除按钮，用户可以选择性地删除特定图层，而不是全部清除。

## 🛠️ 快速开始

### 1. 引入依赖

```html
<link rel="stylesheet" href="./lib/leaflet.css" />
<link rel="stylesheet" href="./lib/leaflet-geoman.css" />

<script src="./lib/leaflet.js"></script>
<script src="./lib/leaflet-geoman.min.js"></script>
<script src="./lib/leaflet.draw.js"></script>
<script src="./leaflet-measure.js"></script>
```

### 2. 初始化组件

```javascript
// 初始化地图
const map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// 初始化测量组件
const measureTool = new L.measureArea(map, {
  // 多边形绘制选项
  polygonOptions: {
    snappable: true,    // 启用吸附功能
    templineStyle: {
      color: '#3288FF'  // 临时线条颜色
    },
    hintlineStyle: {
      color: '#3288FF',  // 提示线条颜色
      dashArray: [5, 5]  // 虚线样式
    },
    pathOptions: {
      color: '#3288FF',      // 路径颜色
      fillColor: '#3288FF',  // 填充颜色
      fillOpacity: 0.2       // 填充透明度
    }
  },
  // 工具栏配置
  toolbarOptions: {
    position: 'topleft',      // 工具栏位置
    drawOnce: false,          // 是否只绘制一次
    showTooltips: true,       // 显示提示信息
    showMeasurements: true    // 显示测量结果
  }
});

// 添加样式
measureTool.addStyles();

// 事件监听示例
measureTool.on('measure:start', (e) => {
  console.log('开始测量', e);
});

measureTool.on('measure:finish', (e) => {
  console.log('测量完成', e);
  console.log('面积：', e.area);
  console.log('单位：', e.unit);
});

measureTool.on('measure:remove', (e) => {
  console.log('删除测量', e);
});
```

## 💡 核心API

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

### 获取测量结果

```javascript
const measurements = measureTool.getMeasurements();
console.log(measurements);
```

## 🌟 技术亮点

1. **优雅的API设计**：所有功能都通过API方法暴露，使用方便，扩展性强。

2. **实时计算**：绘制过程中实时显示面积，提供良好的用户体验。

3. **多单位支持**：支持千米、英里、海里等多种面积单位，满足不同场景需求。

4. **多图层管理**：
   - **独立删除控制**：每个测量图形都有自己的删除按钮，可以选择性删除（Geoman不支持）
   - **多图层并存**：支持同时显示和管理多个测量图层（Geoman不支持）
   - **统一单位切换**：切换单位时，所有图层的面积单位同步更新

5. **交互优化**：
   - 图形绘制时支持吸附功能
   - 面积标注自动定位到图形中心
   - 支持自定义工具栏位置和样式
   - 丰富的事件回调机制

6. **样式美化**：
   - 优雅的删除按钮样式
   - 清晰的面积标注显示
   - 流畅的交互动画
   - 可定制的线条和填充样式
   - 支持虚线提示和高亮效果

## 🎯 使用场景

- 房地产项目中的地块面积测量
- 农林业中的农田面积计算
- 城市规划中的区域面积评估
- 地理信息系统中的面积分析
- 需要同时比较多个区域面积的应用场景

## 📝 最佳实践

1. 在开始新的绘制前，建议先调用`stopDraw()`停止当前绘制
2. 切换图形类型时会自动停止当前绘制
3. 面积单位切换会影响所有已绘制图形的显示
4. 合理配置工具栏选项，提升用户体验：
   ```javascript
   const measureTool = new L.measureArea(map, {
     toolbarOptions: {
       position: 'topleft',      // 建议放置在左上角
       drawOnce: false,          // 允许连续绘制
       showTooltips: true        // 显示操作提示
     }
   });
   ```
5. 利用事件监听实现业务逻辑：
   ```javascript
   // 测量完成后保存数据
   measureTool.on('measure:finish', (e) => {
     saveToDatabase({
       area: e.area,
       unit: e.unit,
       coordinates: e.layer.getLatLngs()
     });
   });

   // 删除测量时更新UI
   measureTool.on('measure:remove', (e) => {
     updateUI();
     removeFromDatabase(e.id);
   });
   ```
6. 性能优化建议：
   - 大量测量图形时，考虑使用图层组管理
   - 适当使用`drawOnce: true`减少内存占用
   - 及时清理不需要的测量图形
   - 避免频繁切换单位造成重绘开销

## 🔮 未来展望

1. 支持更多测量类型（如距离测量）
2. 添加更多自定义样式选项
3. 支持测量数据的导入导出
4. 优化移动端适配
5. 增强与其他Leaflet插件的兼容性

## 🎁 结语

这个基于Leaflet和Geoman二次开发的测量组件不仅继承了Geoman的强大功能，还解决了多测量图层管理的痛点。它让你能够轻松实现多个测量图形的创建、显示和独立删除，大大提升了地图测量的灵活性和用户体验。如果觉得有帮助，欢迎到GitHub给个Star！

> 作者：Luke
> 
> 本文首发于掘金，转载请注明出处。