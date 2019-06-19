<template>
  <div class="peopleinfor-dialog" :style="mainDialogStyle">
    <div class="close-btn" @click="$emit('close-dialog')">
      <img src="../assets/cross.png"/>
    </div>
    <div class="peopleinfor-main">
      <!-- Carousel走马灯样式 -->
      <div class="peopleinfor-main-carousel">
        <el-carousel trigger="click" height="inherit" :autoplay="false" @change="onCarouselChange">
          <el-carousel-item>
            <div style="margin:10px 50px;text-align:left;">
              <p>姓名：{{ basicInformation.ChName }}</p>
            </div>
          </el-carousel-item>
          <el-carousel-item>
            <div style="margin:10px 50px;text-align:left;">
              <p>别名：{{ aliases }}</p>
            </div>
          </el-carousel-item>
          <el-carousel-item>
            <div style="margin:10px 50px;text-align:left;">
              Postings
            </div>
          </el-carousel-item>
          <el-carousel-item>
            <div style="margin:10px 50px;text-align:left;">
              Social Status
            </div>
          </el-carousel-item>
          <el-carousel-item>
            <div style="margin:10px 50px;text-align:left;">
              Kinship
            </div>
          </el-carousel-item>
          <el-carousel-item>
            <div style="margin:10px 50px;text-align:left;">
              Association
            </div>
          </el-carousel-item>
          <el-carousel-item>
            <div style="margin:10px 50px;text-align:left;">
              Works
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
      // 2
      aliases: [],
      addresses: [],
      entry: [],
      // 3
      postings: [],
      // 4
      socialStatus: [],
      // 5
      kinship: [],
      // 6
      association: [],
      // 7
      works: []
    }
  },
  methods: {
    updateBasicInformation() {
      const self = this;
      self.$axios.post('/api/person-information', {
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
        self.$axios.post('/api/person-information-sources', {
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
        self.$axios.post('/api/person-aliases', {
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
        self.$axios.post('/api/person-addresses', {
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
        self.$axios.post('/api/person-entry', {
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
        self.$axios.post('/api/person-postings', {
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
        self.$axios.post('/api/person-social-status', {
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
        self.$axios.post('/api/person-kinship', {
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
        self.$axios.post('/api/person-association', {
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
        self.$axios.post('/api/person-works', {
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
      switch (idx) {
        case 1:
          this.updateAliases();
          this.updateAddresses();
          this.updateEntry();
          break;
        case 2:
          this.updatePostings();
          break;
        case 3:
          this.updateSocialStatus();
          break;
        case 4:
          this.updateKinship();
          break;
        case 5:
          this.updateAssociation();
          break;
        case 6:
          this.updateWorks();
          break;
        case 0:
        default:
          break;
      }
    }
  },
  created() {
    this.updateBasicInformation();
  },
}
</script>

<style>
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
