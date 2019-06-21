<template>
  <div class="peopleinfor-dialog" :style="mainDialogStyle">
    <div class="close-btn" @click="$emit('close-dialog')">
      <img src="../assets/cross.png"/>
    </div>
    <div class="peopleinfor-main">
      <!-- Carousel走马灯样式 -->
      <div class="peopleinfor-main-carousel">
        <el-carousel trigger="click" height="inherit" :autoplay="false" @change="onCarouselChange">
          
          <!-- 1. Basic information -->
          <el-carousel-item>
            <div class="peopleinfor-carousel-item">
              <table>
                <col width="100px"/>
                <tr>
                  <td>CBDB ID</td>
                  <td>{{ basicInformation.PersonId }}</td>
                </tr>
                <tr>
                  <td>中文/英文名</td>
                  <td>{{ basicInformation.ChName }}/{{ basicInformation.EngName }}</td>
                </tr>
                <tr>
                  <td>生年</td>
                  <td>
                    <span v-if="basicInformation.EraYearBirth">
                      {{ basicInformation.DynastyBirth }}
                      {{ basicInformation.EraBirth }}
                      {{ basicInformation.EraYearBirth }}年
                    </span>
                    <span v-if="basicInformation.YearBirth">
                      ({{ basicInformation.YearBirth }})
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>卒年</td>
                  <td>
                    <span v-if="basicInformation.EraYearDeath">
                      {{ basicInformation.DynastyDeath }}
                      {{ basicInformation.EraDeath }}
                      {{ basicInformation.EraYearDeath }}年
                    </span>
                    <span v-if="basicInformation.YearDeath">
                      ({{ basicInformation.YearDeath }})
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>享年</td>
                  <td>
                    <span v-if="basicInformation.YearsLived">{{ basicInformation.YearsLived }}岁</span>
                    <span v-else>Unknown</span>
                  </td>
                </tr>
                <tr>
                  <td>性别</td>
                  <td>{{ basicInformation.Gender === 0 ? '男' : '女'}}</td>
                </tr>
                <tr>
                  <td>郡望</td>
                  <td>{{ basicInformation.JunWang }}</td>
                </tr>
                <tr>
                  <td>社会区分</td>
                  <td>
                    <div v-for="item in socialStatus" :key="item.StatusName">{{ item.StatusName }}</div>
                  </td>
                </tr>
                <tr>
                  <td>地籍信息</td>
                  <td>
                    <ol style="margin:0 -20px;">
                      <li v-for="item in addresses" :key="item.belongs5_name + item.belongs4_name + item.belongs3_name + item.belongs2_name + item.belongs1_name">
                        <span>{{ item.AddrType }} : </span>
                        <span>
                          {{ item.belongs5_name ? item.belongs5_name + ' / ' : '' }}
                          {{ item.belongs4_name ? item.belongs4_name + ' / ' : '' }}
                          {{ item.belongs3_name ? item.belongs3_name + ' / ' : '' }}
                          {{ item.belongs2_name ? item.belongs2_name + ' / ' : '' }}
                          {{ item.belongs1_name ? item.belongs1_name + ' / ' : '' }}
                          {{ item.AddrName }}
                        </span>
                        <br/>
                        <ul>
                          <li>出处：{{ item.Source }} <span v-if="item.Pages !== '0000'">({{ item.Pages }})页</span></li>
                          <li v-if="item.Notes">注记：{{ item.Notes }}</li>
                        </ul>
                      </li>
                    </ol>
                  </td>
                </tr>
                <tr style="height:15px;"></tr>
                <tr>
                  <td>别名</td>
                  <td>
                    <table>
                      <tr v-for="item in aliases" :key="item.AliasType">
                        <td>{{ item.AliasType }}</td>
                        <td>{{ item.AliasName }}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr style="height:15px;"></tr>
                <tr>
                  <td>入仕信息</td>
                  <td>
                    <div v-for="item in entry" :key="item.RuShiDoor">
                      入仕门：{{ item.RuShiDoor }}
                      <br/>
                      入仕别：{{ item.RuShiType }}
                      <br/>
                      <ul style="margin:0;">
                        <li>出处：{{ item.Source }} <span v-if="item.Pages">({{ item.Pages }})页</span></li>
                        <li v-if="item.Notes">注记：{{ item.Notes }}</li>
                      </ul>
                    </div>
                  </td>
                </tr>
              </table>
              <hr/>
              <table>
                <col width="100px"/>
                <tr>
                  <td>注</td>
                  <td>{{ basicInformation.Notes }}</td>
                </tr>
                <tr>
                  <td>出处</td>
                  <table>
                    <tr v-for="item in informationSources" :key="item.Source">
                      <td style="font-weight:normal;">{{ item.Source }}</td>
                      <td>{{ item.Pages }}(页)</td>
                    </tr>
                  </table>
                </tr>
              </table>
            </div>
          </el-carousel-item>
          
          <!-- 2. Posting information -->
          <el-carousel-item>
            <div class="peopleinfor-carousel-item">
              <h1 style="text-align:left;margin:0;">任官</h1>
              <ol>
                <li v-for="item in postings" :key="item.OfficeName + item.FirstYear">
                  <span>{{ item.OfficeName }} </span>
                  <span style="display:inline-block;border:1px solid black;"> {{ item.ChuShouType }}</span>
                  <br/>
                  <ul>
                    <li>地点：{{ item.AddrName }}</li>
                    <li>起始年: {{ item.FirstYear === 0 ? '未详' : item.FirstYear + '[' + item.FirstYearRange + ']' }}</li>
                    <li>终止年：{{ item.LastYear === 0 ? '未详' : item.LastYear + '[' + item.LastYearRange + ']' }}</li>
                    <li v-if="item.Source"><span style="font-weight:bold;">出处：</span>{{ item.Source }}</li>
                    <li v-if="item.Pages">{{ item.Pages }}(页)</li>
                  </ul>
                </li>
              </ol>
            </div>
          </el-carousel-item>

          <!-- 3. Kinship information -->
          <el-carousel-item>
            <div class="peopleinfor-carousel-item">
              <h1 style="text-align:left;margin:0;">亲属关系</h1>
              <ol>
                <li v-for="item in kinship" :key="item.KinPersonName + ' - ' + item.KinRelName">
                  <span>
                    <a :href="'https://cbdb.fas.harvard.edu/cbdbapi/person.php?id=' + item.KinPersonId" target="_blank">
                      {{ item.KinPersonName }}
                    </a>
                  </span>
                  [<span style="font-weight:bold;">{{ item.KinRelName }}</span>]
                  <br/>
                  <ul>
                    <li>
                      <span v-if="item.Source">出处：{{ item.Source }}</span>
                      <span v-if="item.Pages">({{ item.Pages }}页)</span>
                    </li>
                    <li v-if="item.Notes">注记：{{ item.Notes }}</li>
                  </ul>
                </li>
              </ol>
            </div>
          </el-carousel-item>

          <!-- 4. Social association -->
          <el-carousel-item>
            <div class="peopleinfor-carousel-item">
              <h1 style="text-align:left;margin:0;">社会关系</h1>
              <ol>
                <li v-for="item in association" :key="item.AssocCode + item.AssocPersonId">
                  <span>
                    {{ item.AssocName.split('Y')[0] }}
                    <a :href="'https://cbdb.fas.harvard.edu/cbdbapi/person.php?id=' + item.AssocPersonId" target="_blank">
                      {{ item.AssocPersonName }}
                    </a>
                    {{ item.AssocName.split('Y')[1] }}
                  </span>
                  <br/>
                  <ul>
                    <li>
                      <span v-if="item.Source">出处：{{ item.Source }}</span>
                      <span v-if="item.Pages">({{ item.Pages }}页)</span>
                    </li>
                    <li v-if="item.Notes">注记：{{ item.Notes }}</li>
                  </ul>
                </li>
              </ol>
            </div>
          </el-carousel-item>

          <!-- 5. Works -->
          <el-carousel-item>
            <div class="peopleinfor-carousel-item">
              <h1 style="text-align:left;margin:0;">作品</h1>
              <ol>
                <li v-for="item in works" :key="item.TextId">
                  <span style="font-weight:bold;">{{ item.TextName }}</span>
                  <br/>
                  <ul>
                    <li v-if="item.Year">创作年代：{{ item.Year }}</li>
                    <li>出处：{{ item.Source }}</li>
                    <li>角色：{{ item.Role }}</li>
                  </ul>
                </li>
              </ol>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
    <div class="peopleinfor-reference">
      CBDB API: <a :href="'https://cbdb.fas.harvard.edu/cbdbapi/person.php?id=' + c_personid" target="_blank">{{ basicInformation.ChName }}</a>
    </div>
  </div>
</template>

<script>
import S from 'chinese-s2t';

export default {
  name: 'people-information-dialog',
  props: {
    c_personid: {
      type: Number,
      required: true
    }
  },
  watch: {
    c_personid: function (val, oldVal) {
      if (val != oldVal) {
        this.informationSources = [];
        this.aliases = [];
        this.addresses = [];
        this.entry = [];
        this.postings = [];
        this.socialStatus = [];
        this.kinship = [];
        this.association = [];
        this.works = [];

        this.updateBasicInformation();
        this.updateSources();
        this.updateAliases();
        this.updateAddresses();
        this.updateEntry();
        this.updatePostings();
        this.updateSocialStatus();
        this.updateKinship();
        this.updateAssociation();
        this.updateWorks();
      }
    }
  },
  data() {
    return {
      mainDialogStyle: {
        height: innerHeight * 0.8 + 'px',
        width: innerHeight * 0.8 + 'px',
        left: (innerWidth * 0.5 - innerHeight * 0.4) + 'px',
        top: innerHeight * 0.1 + 'px'
      },
      // 1
      basicInformation: {
        ChName: ''
      },
      informationSources: [],
      aliases: [],
      addresses: [],
      entry: [],
      socialStatus: [],
      // 2
      postings: [],
      // 3
      kinship: [],
      // 4
      association: [],
      // 5
      works: []
    }
  },
  methods: {
    updateBasicInformation() {
      const self = this;
      self.$axios.post('/hi_story/person-information', {
        c_personid: self.c_personid
      })
      .then( response => {
        const results = response.data.results;

        // Traditional to Simple Chinese
        let tResultsStr = JSON.stringify(results);
        let sResultsStr = S.t2s(tResultsStr);

        self.basicInformation = JSON.parse(sResultsStr);
      })
      .catch( error => {
        if (error) {
          console.log(error);
        }
      });
    },
    updateSources () {
      const self = this;
      if (self.informationSources.length === 0) {
        self.$axios.post('/hi_story/person-information-sources', {
          c_personid: self.c_personid
        })
        .then( response => {
          const results = response.data.results;

          // Traditional to Simple Chinese
          let tResultsStr = JSON.stringify(results);
          let sResultsStr = S.t2s(tResultsStr);

          self.informationSources = JSON.parse(sResultsStr);
        })
        .catch( error => {
          if (error) {
            console.log(error);
          }
        });
      }
    },
    updateAliases () {
      const self = this;
      if (self.aliases.length === 0) {
        self.$axios.post('/hi_story/person-aliases', {
          c_personid: self.c_personid
        })
        .then( response => {
          const results = response.data.results;

          // Traditional to Simple Chinese
          let tResultsStr = JSON.stringify(results);
          let sResultsStr = S.t2s(tResultsStr);

          self.aliases = JSON.parse(sResultsStr);
        })
        .catch( error => {
          if (error) {
            console.log(error);
          }
        });
      }
    },
    updateAddresses () {
      const self = this;
      if (self.addresses.length === 0) {
        self.$axios.post('/hi_story/person-addresses', {
          c_personid: self.c_personid
        })
        .then( response => {
          const results = response.data.results;

          // Traditional to Simple Chinese
          let tResultsStr = JSON.stringify(results);
          let sResultsStr = S.t2s(tResultsStr);

          self.addresses = JSON.parse(sResultsStr);
        })
        .catch( error => {
          if (error) {
            console.log(error);
          }
        });
      }
    },
    updateEntry () {
      const self = this;
      if (self.entry.length === 0) {
        self.$axios.post('/hi_story/person-entry', {
          c_personid: self.c_personid
        })
        .then( response => {
          const results = response.data.results;

          // Traditional to Simple Chinese
          let tResultsStr = JSON.stringify(results);
          let sResultsStr = S.t2s(tResultsStr);

          self.entry = JSON.parse(sResultsStr);
        })
        .catch( error => {
          if (error) {
            console.log(error);
          }
        });
      }
    },
    updatePostings () {
      const self = this;
      if (self.postings.length === 0) {
        self.$axios.post('/hi_story/person-postings', {
          c_personid: self.c_personid
        })
        .then( response => {
          const results = response.data.results;

          // Traditional to Simple Chinese
          let tResultsStr = JSON.stringify(results);
          let sResultsStr = S.t2s(tResultsStr);

          self.postings = JSON.parse(sResultsStr);
        })
        .catch( error => {
          if (error) {
            console.log(error);
          }
        });
      }
    },
    updateSocialStatus () {
      const self = this;
      if (self.socialStatus.length === 0) {
        self.$axios.post('/hi_story/person-social-status', {
          c_personid: self.c_personid
        })
        .then( response => {
          const results = response.data.results;

          // Traditional to Simple Chinese
          let tResultsStr = JSON.stringify(results);
          let sResultsStr = S.t2s(tResultsStr);

          self.socialStatus = JSON.parse(sResultsStr);
        })
        .catch( error => {
          if (error) {
            console.log(error);
          }
        });
      }
    },
    updateKinship () {
      const self = this;
      if (self.kinship.length === 0) {
        self.$axios.post('/hi_story/person-kinship', {
          c_personid: self.c_personid
        })
        .then( response => {
          const results = response.data.results;

          // Traditional to Simple Chinese
          let tResultsStr = JSON.stringify(results);
          let sResultsStr = S.t2s(tResultsStr);

          self.kinship = JSON.parse(sResultsStr);
        })
        .catch( error => {
          if (error) {
            console.log(error);
          }
        });
      }
    },
    updateAssociation () {
      const self = this;
      if (self.association.length === 0) {
        self.$axios.post('/hi_story/person-association', {
          c_personid: self.c_personid
        })
        .then( response => {
          const results = response.data.results;

          // Traditional to Simple Chinese
          let tResultsStr = JSON.stringify(results);
          let sResultsStr = S.t2s(tResultsStr);

          self.association = JSON.parse(sResultsStr);
        })
        .catch( error => {
          if (error) {
            console.log(error);
          }
        });
      }
    },
    updateWorks () {
      const self = this;
      if (self.works.length === 0) {
        self.$axios.post('/hi_story/person-works', {
          c_personid: self.c_personid
        })
        .then( response => {
          const results = response.data.results;

          // Traditional to Simple Chinese
          let tResultsStr = JSON.stringify(results);
          let sResultsStr = S.t2s(tResultsStr);

          self.works = JSON.parse(sResultsStr);
        })
        .catch( error => {
          if (error) {
            console.log(error);
          }
        });
      }
    },
    onCarouselChange (idx) {
      // switch (idx) {
      //   case 1:
      //     this.updateAliases();
      //     this.updateAddresses();
      //     this.updateEntry();
      //     this.updatePostings();
      //     this.updateSocialStatus();
      //     break;
      //   case 2:
      //     this.updateKinship();
      //     break;
      //   case 3:
      //     this.updateAssociation();
      //     break;
      //   case 4:
      //     this.updateWorks();
      //     break;
      //   case 0:
      //   default:
      //     break;
      // }
    }
  },
  created() {
    this.updateBasicInformation();
    this.updateSources();
    this.updateAliases();
    this.updateAddresses();
    this.updateEntry();
    this.updatePostings();
    this.updateSocialStatus();
    this.updateKinship();
    this.updateAssociation();
    this.updateWorks();
  },
}
</script>

<style>
hr {
  border: 1px dashed gray;
}
.peopleinfor-dialog {
  position: absolute;
  border: 2px dashed rgb(123, 125, 231);
  background-color: rgba(240, 251, 255, 0.9);
  border-radius: 15px;
}
.close-btn {
  position: absolute;
  top: 3px;
  right: 3px;
  height: 40px;
  width: auto;
  cursor: pointer;
  z-index: 3;
}
.close-btn img {
  height: inherit;
  width: inherit;
}
.peopleinfor-reference {
  position: absolute;
  bottom: 10px;
  left: 10px;
}
.peopleinfor-reference a {
  color: #0c88e8;
  text-decoration: none;
}
.peopleinfor-reference a:hover {
  text-decoration: underline;
}
.peopleinfor-main {
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 35px;
  border-radius: 10px;
}
.peopleinfor-main-carousel {
  position: absolute;
  height: 100%;
  width: 100%;
}
.peopleinfor-carousel-item {
  position: absolute;
  top: 30px;
  left: 50px;
  right: 50px;
  bottom: 30px;
  text-align: left;
  overflow-y: scroll;
}
.peopleinfor-carousel-item a {
  text-decoration: none;
  color: #0c88e8;
}
.peopleinfor-carousel-item a:hover {
  text-decoration: underline;
}
/* 表格首列样式 */
.peopleinfor-main-carousel tr td:nth-child(1) {
  font-weight: bold;
  vertical-align: top;
}
.el-carousel {
  height: inherit;
  border-radius: 5px;
}
.el-carousel__item:nth-child(2n) {
    background-color: rgb(245, 249, 208);
}

.el-carousel__item:nth-child(2n+1) {
    background-color: #F9EDD0;
}
</style>
