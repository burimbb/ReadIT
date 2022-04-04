<template>
  <div>
    <div class="input-group">
      <div class="custom-file">
        <input type="file" ref="file" class="custom-file-input" id="attachmentsgroup" @change="selectedFiles" accept="image/x-png,image/gif,image/jpeg" multiple>
        <label class="custom-file-label" for="attachmentsgroup" v-text="label"></label>
      </div>
      <div class="input-group-append">
        <button class="btn btn-outline-danger" type="button" id="inputGroupFileAddon04" @click="clearImages()">Clear</button>
      </div>
    </div>
   <div class="rounded mt-2 p-2 overflow-div scrollbar" id="overflow-div" v-if="attachments.length">
      <div v-for="(attachment, index) in attachments" :key="index" class="shadow-lg mb-2 force-overflow position-relative">
        <div class="badge badge-success rounded-circle p-2 attachment-badge" v-if="scannedFiles.map(item => item).includes(index)">
          <i class="fa fa-check is-success" aria-hidden="true"></i>
        </div>

        <img @click="$emit('selected-img', index), selectedAttachment = index" :src="attachment" alt="img" class="img-thumbnail" :style="selectedAttachment == index ? 'border: 3px solid rgb(47, 46, 65);': ''" />
      </div>
    </div>
  </div>
</template>

<script>
    import 'font-awesome/css/font-awesome.min.css';

    export default {
      props: [
        'scanned'
      ],

      data(){
        return {
          label: "Choose file",
          attachments: [],

          selectedAttachment: 0,
          scannedFiles: this.scanned
        }
      },

      watch: {
        scanned(newVal){
          this.scannedFiles = newVal
        }
      },

      methods: {
        selectedFiles(event){
          this.loadImages(event)

          if(event.target.files.length > 1){
            this.label = "Selected "+event.target.files.length+" images"
          }else{
            /* this.label = event.target.value; */
            this.label = "Selected"
          }

          this.scannedFiles = []
        },

        loadImages(event){
          if(! event.target.files.length) return
          this.clearImages()
          let files = Object.entries(event.target.files)

          files.forEach(file => {
            let reader = new FileReader()
            reader.readAsDataURL(file[1])

            reader.onload = e => {
              let src = e.target.result

              this.attachments.push(src)
            }
          })
          // this.file = this.$refs.file.files[0];
          this.$emit('onFileChange', this.$refs.file.files[0])
          this.$emit('onFilesChange', files)
        },

        clearImages(){
          this.attachments = []
          this.label = "Choose file"
          this.$emit('clear')
        }
      }
    }
</script>

<style lang="css">
  .overflow-div{
    overflow-y: scroll;
    height: 630px;
    position: relative;
  }
  #overflow-div::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    background-color: #F5F5F5; border-radius: 10px;
  }
  #overflow-div::-webkit-scrollbar {
    width: 10px;
    background-color: #F5F5F5;
  }
  #overflow-div::-webkit-scrollbar-thumb {
    border-radius: 10px; background-image:
    -webkit-gradient(linear, left bottom, left top,
    color-stop(0.44,#575578),
    color-stop(0.72, #575578),
    color-stop(0.86, #575578));
  }
  .attachment-badge{
    position: absolute;
    top: 12px;
    right: 12px;
    color: #fff;
    font-weight: normal;
  }

</style>
