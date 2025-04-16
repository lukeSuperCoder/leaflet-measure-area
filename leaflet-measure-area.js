/**
 * Leaflet测量工具插件
 * 提供地图面积测量功能，支持多边形绘制、面积计算、单位切换和删除功能
 */
L.MeasureArea = L.Class.extend({
  options: {
    position: 'topleft',
    drawPolygon: false,
    drawRectangle: false,
    drawMarker: false,
    drawCircle: false,
    drawCircleMarker: false,
    drawPolyline: false,
    editMode: true,
    dragMode: false,
    cutPolygon: false,
    removalMode: false,
    language: 'zh',
    polygonOptions: {
      snappable: true,
      templineStyle: {
        color: 'red'
      }
    }
  },

  initialize: function(map, options) {
    this.map = map;
    L.setOptions(this, options);
    
    // 存储所有绘制的图层
    this.drawnLayers = [];
    
    // 单位切换相关
    this.units = ['千米', '英里', '海里'];
    this.currentUnitIndex = 0;
    
    // 单位转换系数 (从平方米转换)
    this.conversionFactors = {
      '千米': 1e6,        // 1 km² = 1,000,000 m²
      '英里': 2589988.11, // 1 mi² = 2,589,988.11 m²
      '海里': 3429904     // 1 nmi² = 3,429,904 m²
    };
    
    // 单位符号
    this.unitSymbols = {
      '千米': 'km²',
      '英里': 'mi²',
      '海里': 'nmi²'
    };

    this._init();
  },

  _init: function() {
    // 添加绘图工具(暂不支持)
    // this.map.pm.addControls({
    //   position: this.options.position,
    //   drawPolygon: this.options.drawPolygon,
    //   drawMarker: this.options.drawMarker,
    //   drawCircle: this.options.drawCircle,
    //   drawCircleMarker: this.options.drawCircleMarker,
    //   drawPolyline: this.options.drawPolyline,
    //   drawRectangle: this.options.drawRectangle,
    //   editMode: this.options.editMode,
    //   dragMode: this.options.dragMode,
    //   cutPolygon: this.options.cutPolygon,
    //   removalMode: this.options.removalMode
    // });

    // 设置语言
    this.map.pm.setLang(this.options.language);
    
    // 监听绘制完成事件
    this.map.on('pm:create', this._handleDrawComplete, this);
  },

  _handleDrawComplete: function(e) {
    const layer = e.layer;
    
    // 计算面积
    const areaText = this.calculateArea(layer);
    
    // 创建面积标记
    const areaMarker = this._createAreaMarker(layer, areaText);
    
    // 为图层添加删除按钮
    const deleteMarker = this._createDeleteButton(layer);
    
    // 将图层和标记存储到数组中
    this.drawnLayers.push({
      layer: layer,
      deleteMarker: deleteMarker,
      areaMarker: areaMarker
    });
  },

  _createDeleteButton: function(layer) {
    // 获取图层的第一个点位
    let firstPoint;
    if (layer instanceof L.Circle) {
      // 对于圆形，使用圆心作为第一个点
      firstPoint = layer.getLatLng();
    } else {
      // 对于多边形，获取第一个顶点
      const latlngs = layer.getLatLngs()[0];
      firstPoint = latlngs[0];
    }
    
    // 创建自定义HTML元素作为删除按钮
    const deleteIcon = L.divIcon({
      className: 'delete-marker',
      html: 'X',
      iconSize: [20, 20]
    });
    
    // 创建标记并添加到地图
    const deleteMarker = L.marker(firstPoint, {
      icon: deleteIcon,
      zIndexOffset: 1000, // 确保删除按钮在图层上方
      interactive: true,  // 确保标记可交互
      bubblingMouseEvents: false // 阻止鼠标事件冒泡到地图
    }).addTo(this.map);
    
    // 点击删除按钮时移除图层
    deleteMarker.on('click', (e) => {
      // 阻止事件冒泡，避免触发地图的点击事件
      L.DomEvent.stopPropagation(e);
      
      this.map.removeLayer(layer);
      this.map.removeLayer(deleteMarker);
      
      // 从数组中查找并移除图层
      const index = this.drawnLayers.findIndex(item => item.layer === layer);
      if (index !== -1) {
        // 移除面积标记
        if (this.drawnLayers[index].areaMarker) {
          this.map.removeLayer(this.drawnLayers[index].areaMarker);
        }
        this.drawnLayers.splice(index, 1);
      }
    });
    
    // 添加鼠标悬停事件
    deleteMarker.on('mouseover', function() {
      // 手动设置鼠标样式
      document.body.style.cursor = 'pointer';
    });
    
    deleteMarker.on('mouseout', function() {
      // 恢复默认鼠标样式
      document.body.style.cursor = '';
    });
    
    return deleteMarker;
  },

  calculateArea: function(layer) {
    let area;
    
    if (layer instanceof L.Circle) {
      const radius = layer.getRadius();
      area = Math.PI * Math.pow(radius, 2); // 单位平方米
    } else if (typeof layer.getLatLngs === 'function') {
      const latlngs = layer.getLatLngs();
      // 检查是否有足够的点来计算面积
      if (latlngs && latlngs[0] && latlngs[0].length > 1) {
        area = L.GeometryUtil.geodesicArea(latlngs[0]); // 单位平方米
      } else {
        area = 0; // 点数不足，无法计算面积
      }
    } else {
      area = 0; // 图层不支持面积计算
    }
    
    const currentUnit = this.units[this.currentUnitIndex];
    const convertedArea = area / this.conversionFactors[currentUnit];
    return convertedArea.toFixed(2) + ' ' + this.unitSymbols[currentUnit];
  },

  _createAreaMarker: function(layer, areaText) {
    // 获取图层的中心点
    let center;
    if (layer instanceof L.Circle) {
      center = layer.getLatLng();
    } else {
      // 对于多边形，计算中心点
      const bounds = layer.getBounds();
      center = bounds.getCenter();
    }
    
    // 创建自定义HTML元素作为面积标记
    const areaIcon = L.divIcon({
      className: 'area-marker',
      html: areaText,
      iconSize: [100, 20],
      iconAnchor: [50, 10]
    });
    
    // 创建标记并添加到地图
    const areaMarker = L.marker(center, {
      icon: areaIcon,
      zIndexOffset: 900, // 确保在图层上方但在删除按钮下方
      interactive: false // 不可交互，避免干扰地图操作
    }).addTo(this.map);
    
    return areaMarker;
  },

  _updateAllAreasDisplay: function() {
    this.drawnLayers.forEach(item => {
      const areaText = this.calculateArea(item.layer);
      
      // 移除旧的面积标记
      if (item.areaMarker) {
        this.map.removeLayer(item.areaMarker);
      }
      
      // 创建新的面积标记
      item.areaMarker = this._createAreaMarker(item.layer, areaText);
    });
  },

  switchUnit: function() {
    this.currentUnitIndex = (this.currentUnitIndex + 1) % this.units.length;
    const currentUnit = this.units[this.currentUnitIndex];
    
    // 更新所有图层的面积显示
    this._updateAllAreasDisplay();
    
    return currentUnit;
  },

  getCurrentUnit: function() {
    return this.units[this.currentUnitIndex];
  },

  startDraw: function(shape) {
    this.isDrawing = true;
    if (shape === 'Rectangle') {
      this.map.pm.enableDraw('Rectangle', this.options.polygonOptions);
    } else if (shape === 'Circle') {
      this.map.pm.enableDraw('Circle', this.options.polygonOptions);
    } else {
      this.map.pm.enableDraw('Polygon', this.options.polygonOptions);
    }
  },

  stopDraw: function() {
    this.map.pm.disableDraw();
  },

  clearAll: function() {
    // 移除所有图层和标记
    this.drawnLayers.forEach(item => {
      this.map.removeLayer(item.layer);
      this.map.removeLayer(item.deleteMarker);
      if (item.areaMarker) {
        this.map.removeLayer(item.areaMarker);
      }
    });
    
    // 清空数组
    this.drawnLayers = [];
  },

  getMeasurements: function() {
    return this.drawnLayers.map(item => {
      return {
        layer: item.layer,
        area: this.calculateArea(item.layer),
        latlngs: item.layer instanceof L.Circle ? 
          { center: item.layer.getLatLng(), radius: item.layer.getRadius() } : 
          item.layer.getLatLngs()
      };
    });
  },

  addStyles: function(addStyles = true) {
    if (!addStyles) return;
    
    // 如果已存在样式则不重复添加
    if (document.getElementById('leaflet-measure-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'leaflet-measure-styles';
    style.innerHTML = `
      .delete-marker {
        background-color: white;
        border-radius: 50%;
        border: 2px solid red;
        width: 20px;
        height: 20px;
        text-align: center;
        line-height: 18px;
        font-weight: bold;
        color: red;
        cursor: pointer !important;
        box-shadow: 0 1px 3px rgba(0,0,0,0.4);
      }
      
      .leaflet-marker-icon.delete-marker:hover {
        transform: scale(1.1);
        box-shadow: 0 2px 5px rgba(0,0,0,0.5);
        cursor: pointer !important;
        z-index: 10000 !important;
      }
      
      .leaflet-marker-pane .leaflet-marker-icon.delete-marker {
        cursor: pointer !important;
      }
      
      .area-marker {
        background: transparent;
        border: none;
        box-shadow: none;
        font-size: 14px;
        font-weight: bold;
        color: #3388ff;
        text-shadow: 1px 1px 2px white, -1px -1px 2px white, 1px -1px 2px white, -1px 1px 2px white;
        text-align: center;
        width: auto !important;
      }
    `;
    
    document.head.appendChild(style);
  }
});

// 工厂函数
L.measureArea = function(map, options) {
  return new L.MeasureArea(map, options);
};