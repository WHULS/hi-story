<template>
<div>
  <div class="function-area" :style="FunctionStyle">
    <div class="function-header" @click.stop="onDynastyClick()">
      <img src="../assets/king.png"/>
      朝代
      <img :class="DynastyImageClass" src="../assets/array.png"/>
    </div>
    <div class="function-header" @click.stop="onPeopleClick()">
      <img src="../assets/people.png"/>
      人物
      <img :class="PeopleImageClass" src="../assets/array.png"/>
    </div>
    <div class="function-header" @click.stop="onToolsClick()">
      <img src="../assets/tool.png"/>
      工具栏
      <img :class="ToolsImageClass" src="../assets/array.png"/>
    </div>
  </div>
  
  <div :style="Dynasty.dialogStyle" v-if="isDynastyDialogShow" class="dialog-content" @click.stop>
    <p class="dialog-header">{{ dynastyData.header }}</p>
    <div v-for="item in dynastyData.parts" :key="item.header">
      <hr>
      <p class="dialog-header">{{ item.header }}</p>
      <span v-for="layer in item.layers" :key="layer.identifier" class="link-span" @click="onOneDynastyClick(layer.identifier)">{{ layer.name }}</span>
    </div>
  </div>

  <div :style="People.dialogStyle" v-if="isPeopleDialogShow" class="dialog-content" @click.stop>

  </div>

  <div :style="Tools.dialogStyle" v-if="isToolsDialogShow" @click.stop class="tools-dialog">
    <div @click="onScreenShotClick()">
      <img src="../assets/screenshot.png" style="height:15px;"/>
      截图
    </div>
    <div @click="onQuestionClick()">
      <img src="../assets/book.png"/>
      知识问答
    </div>
    <div @click="onQueryClick()" @mouseenter="onQueryClick()" @mouseleave="isQueryDialogShow = false;">
      <img src="../assets/search.png"/>
      范围查询
      <img src="../assets/array.png"/>
      <div v-if="isQueryDialogShow" class="query-dialog">
        <div>
          <div @click="onQueryPeople">人物</div>
          <div @click="onQueryWork">作品</div>
          <div @click="onQueryEvent">事件</div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import bus from './bus.js';

export default {
  name: 'functionArea',
  watch: {
    isToolsDialogShow: function (val, oldVal) {
      if (val === true) {
        this.isQueryDialogShow = false;
      }
    }
  },
  computed: {
    DynastyImageClass: function () {
      return {
        'array-image': true,
        'array-down': !this.isDynastyDialogShow,
        'array-up': this.isDynastyDialogShow
      }
    },
    PeopleImageClass: function () {
      return {
        'array-image': true,
        'array-down': !this.isPeopleDialogShow,
        'array-up': this.isPeopleDialogShow
      }
    },
    ToolsImageClass: function () {
      return {
        'array-image': true,
        'array-down': !this.isToolsDialogShow,
        'array-up': this.isToolsDialogShow
      }
    },
  },
  data() {
    return {
      FunctionStyle: {
        position: 'absolute',
        right: '80px',
        top: '20px',
        'z-index': 4,
        'text-align': 'left',
        width: '280px'
      },
      isDynastyDialogShow: false,
      isPeopleDialogShow: false,
      isToolsDialogShow: false,
      isQueryDialogShow: false,

      Dynasty: {
        dialogStyle: {
          padding: '0 5px 10px',
          width: '274px',
          position: 'absolute',
          margin: '0',
          top: '60px',
          right: '80px',
          'border-radius': '5px',
          'box-shadow': '1px 2px 1px rgba(0, 0, 0, .15)',
          'background-color': 'white'
        }
      },
      People: {
        dialogStyle: {
          padding: '0 5px 10px',
          width: '274px',
          position: 'absolute',
          margin: '0',
          top: '60px',
          right: '80px',
          'border-radius': '5px',
          'box-shadow': '1px 2px 1px rgba(0, 0, 0, .15)',
          'background-color': 'white'
        }
      },
      Tools: {
        dialogStyle: {
          padding: '0 5px',
          width: '100px',
          position: 'absolute',
          margin: '0',
          top: '60px',
          right: '80px',
          'border-radius': '5px',
          'box-shadow': '1px 2px 1px rgba(0, 0, 0, .15)',
          'background-color': 'white',
          'text-align': 'left'
        }
      },
      dynastyData: {
        header: '朝代列表',
        parts: [
          {
            header: '夏商与西周，东周分两半',
            layers: []
          },
          {
            header: '春秋与战国，一统秦两汉',
            layers: [
              {//东汉
                name: '东汉',
                identifier: 'ad0140'
              }
            ]
          },
          {
            header: '三分魏蜀吴，二晋前后延',
            layers: [
              {//三国
                name: '三国',
                identifier: 'ad0262'
              },
              {//西晋
                name: '西晋',
                identifier: 'ad0281'
              },
              {//东晋
                name: '东晋',
                identifier: 'ad0382'
              }
            ]
          },
          {
            header: '南北朝并立，隋唐五代传',
            layers: [
              {//南北朝
                name: '南北朝',
                identifier: 'ad0497'
              },
              {//隋
                name: '隋',
                identifier: 'ad0612'
              },
              {//唐
                name: '唐',
                identifier: 'ad0741'
              }
            ]
          },
          {
            header: '宋元明清后，王朝至此完',
            layers: [
              {//北宋
                name: '北宋',
                identifier: 'ad1111'
              },
              {//南宋
                name: '南宋',
                identifier: 'ad1208'
              },
              {//元
                name: '元',
                identifier: 'ad1330'
              },
              {//明
                name: '明',
                identifier: 'ad1582'
              },
              {//清
                name: '清',
                identifier: 'ad1820'
              },
              {//当代
                name: '当代',
                identifier: 'now'
              },
            ]
          }
        ]
      },
    }
  },
  methods: {
    onDynastyClick() {
      const self = this;
      self.isDynastyDialogShow = !self.isDynastyDialogShow;
      self.isPeopleDialogShow = false;
      self.isToolsDialogShow = false;

      document.onclick = function () {
        self.isDynastyDialogShow = false;
        document.onclick = null;
      }
    },
    onPeopleClick() {
      const self = this;
      self.isDynastyDialogShow = false;
      self.isPeopleDialogShow = !self.isPeopleDialogShow;
      self.isToolsDialogShow = false;

      document.onclick = function () {
        self.isPeopleDialogShow = false;
        document.onclick = null;
      }
    },
    onToolsClick() {
      const self = this;
      self.isDynastyDialogShow = false;
      self.isPeopleDialogShow = false;
      self.isToolsDialogShow = !self.isToolsDialogShow;

      document.onclick = function () {
        self.isToolsDialogShow = false;
        document.onclick = null;
      }
    },
    // Screen show
    onScreenShotClick() {
      this.isToolsDialogShow = false;
      bus.$emit('screen-shot');
    },
    // Q&A
    onQuestionClick() {
      
    },
    // Area query
    onQueryClick() {
      const self = this;
      self.isQueryDialogShow = true;
    },

    // Query people in a certain area
    onQueryPeople() {
      const self = this;
      bus.$once('screen-shotted', rect => {
        let top_left_pt = [rect[0], rect[3]];
        let bottom_right_pt = [rect[2], rect[1]];

        console.log(top_left_pt, bottom_right_pt);
      });

      self.isToolsDialogShow = false;
      bus.$emit('screen-shot');
    },


    // Query people works in a certain area
    onQueryWork() {
      const self = this;
      bus.$once('screen-shotted', rect => {
        let top_left_pt = [rect[0], rect[3]];
        let bottom_right_pt = [rect[2], rect[1]];

        console.log(top_left_pt, bottom_right_pt);
      });

      self.isToolsDialogShow = false;
      bus.$emit('screen-shot');
    },


    // Query history events in a certain area
    onQueryEvent() {
      const self = this;
      bus.$once('screen-shotted', rect => {
        let top_left_pt = [rect[0], rect[3]];
        let bottom_right_pt = [rect[2], rect[1]];

        console.log(top_left_pt, bottom_right_pt);
      });

      self.isToolsDialogShow = false;
      bus.$emit('screen-shot');
    },
    onOneDynastyClick(identifier) {
      this.$emit('dynasty-change', identifier);
    },
  },
}
</script>

<style>
.function-area {
  background-color: white;
  box-shadow: 1px 2px 1px rgba(0, 0, 0, .15);
  padding: 2px;
}
.function-area div {
  display: inline-block;
  border-radius: 2px;
  padding: 5px;
  margin: 0 3px;
}
.function-area img, .tools-dialog img {
  height: 12px;
  width: auto;
}
.function-header, .tools-dialog div {
  cursor: pointer;
}
.tools-dialog div {
  margin: 3px 0;
}
.function-header:hover, .tools-dialog div:hover {
  color: #0c88e8;
}
.array-image {
  height: 10px;
  margin: 0 3px;
}
.array-down {
  transform: rotate(90deg);
}
.array-up {
  transform: rotate(-90deg);
}
.dialog-header {
  text-align: left;
  font-size: 13px;
  font-weight: bold;
  margin: 1px 2px;
  padding: 0;
}
.dialog-content {
  text-align: left;
  font-size: 12px;
  margin: 1px 2px;
  padding: 0;
}
.link-span {
  margin: 0 5px 0 0;
  color: #0c88e8;
  text-decoration: none;
}
.link-span:hover {
  cursor: pointer;
  text-decoration: underline;
}
.query-dialog {
  position: absolute;
  height: 75px;
  width: 60px;
  top: 45px;
  right: -40px;
  text-align: center;
}
/* The next div of query dialog. It's a container of buttons. */
.query-dialog > div {
  background-color: white;
  float: right;
  width: 40px;
  text-align: center;
  border-radius: 2px;
}
/* Div of buttons */
.query-dialog > div div {
  color: #2c3e50;
}
.query-dialog > div div:hover {
  color: #0c88e8;
}
</style>
