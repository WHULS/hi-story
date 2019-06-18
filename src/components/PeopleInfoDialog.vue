<template>
  <div class="peopleinfor-dialog" :style="mainDialogStyle">
    <div class="close-btn" @click="$emit('close-dialog')">
      <img src="../assets/cross.png"/>
    </div>

    <div class="peopleinfor-reference">
      CBDB API: <a :href="'https://cbdb.fas.harvard.edu/cbdbapi/person.php?id=' + c_personid" target="_blank">{{ peopleInformation.c_name_chn }}</a>
    </div>
  </div>
</template>
<script>
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
        this.updateInformation(val);
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
      peopleInformation: {
        c_name_chn: ''
      }
    }
  },
  methods: {
    updateInformation(id) {
      const self = this;
      self.$axios.post('/api/people-information', {
        c_personid: self.c_personid
      })
      .then( response => {
        const results = response.data.results;
        console.log(results);
        self.peopleInformation = results;
      })
      .catch( error => {
        if (error) {
          console.log(error);
        }
      });
    }
  },
  created() {
    this.updateInformation(this.c_personid);
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
</style>
