<template>
  <div class="portrait" :style="PortraitStyle">
    头
  </div>
</template>

<script>
export default {
  data() {
    return {
      PortraitStyle: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        height: '50px',
        width: '50px',
        border: '1px dashed black',
        'border-radius': '25px',
        'vertical-align': 'center',
        'line-height': '50px',
        'font-size': '24px',
        'background-color': 'white'
      }
    }
  },
}
</script>