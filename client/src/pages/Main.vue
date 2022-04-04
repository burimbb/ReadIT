<template>
  <div class="custom-container">
    <div class="row">
      <div class="col-md-3 mt-5">
        <div>
          <div>
            <div class="form-group">
              <label>First Select a Company</label>
              <select class="form-control" v-model="selectedCompany">
                <option
                  v-for="company in getTrainedCompanies"
                  :key="company.id"
                  class="dropdown-item"
                  :value="company"
                >
                  {{ company.name }}
                </option>
              </select>
            </div>

            <attachments
              :scanned="scannedIndexes"
              @onFilesChange="attachesChanged"
              @clear="clearImages()"
              @selected-img="selectedImg"
            ></attachments>
          </div>

          <div class="d-flex justify-content-between mt-3 mb-3">
            <div class="custom-control custom-switch align-self-center">
              <input
                type="checkbox"
                class="custom-control-input"
                id="customSwitch1"
                v-model="autoFiltered"
              />
              <label class="custom-control-label" for="customSwitch1"
                >Auto filter after Scan</label
              >
            </div>
            <button class="btn btn-primary px-4" @click="uploadDocuments()">
              Upload
            </button>
          </div>
          <p class="font-12">Please check the invoice for any mistakes.</p>
        </div>

        <hr class="mt-5" />
      </div>
      <div class="ml-4">
        <canvas
          class="shadow m-5"
          id="canvas"
          width="650"
          height="920"
        ></canvas>
      </div>
      <div v-show="filterResult" class="mt-5 ml-4 col-md-3">
        <div class="align-items-center">
          <div>
            <h4 class="mb-4">Filter Result</h4>
          </div>

          <div class="d-flex justify-content-between">
            <button class="btn btn-primary" @click="showAllLabels()">
              Show All Labels
            </button>

            <div class="dropdown ml-3">
              <button
                      class="btn btn-primary dropdown-toggle"
                      type="button"
                      v-show="exportDataButton"
                      @click="showDropdown = !showDropdown"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
              >
                Export as
              </button>
              <div
                      class="main-con-filter"
                      @click="showDropdown = !showDropdown"
                      v-if="showDropdown"
              ></div>

              <div class="dropdown-menu show" v-show="showDropdown">
                <a
                        class="dropdown-item pointer"
                        @click="exportFilters('txt')"
                >
                  <i class="fa fa-file-text-o mr-2" aria-hidden="true"></i>
                  Txt File
                </a>
                <download-csv :data="json_data" :name="csvName">
                  <a
                          class="dropdown-item pointer"
                          @click="exportFilters('csv')"
                  >
                    <i class="fa fa-file-o mr-2" aria-hidden="true"></i>
                    Csv File
                  </a>
                </download-csv>
                <a
                        class="dropdown-item pointer"
                        @click="exportFilters('json')"
                >
                  <i class="fa fa-file mr-2" aria-hidden="true"></i>
                  Json File
                </a>

                <a
                        class="dropdown-item pointer"
                        @click="downloadData()"
                >
                  <i class="fa fa-file-excel-o mr-2" aria-hidden="true"></i>
                  Excel File
                </a>

              </div>
            </div>
          </div>
        </div>
        <div class="mt-3 mb-3">
          <multiselect
                  v-model="selectedFilters"
                  :options="getComputedLabels"
                  :multiple="true"
                  placeholder="Select Filters"
          >
          </multiselect>

          <div class="text-right">
            <button
                    class="btn btn-primary mt-3"
                    v-show="showSelectScanButton"
                    @click="scanFilters()"
            >
              Scan Filters
            </button>
          </div>
        </div>
        <div class="mt-2">
          <div v-for="(data, index) in selectedDocument.cropedData" :key="index">
            <div v-if="Array.isArray(data.scannedData)">
                <div class="card-header mb-1" :style="'background:' + data.label.color + '; color: white'" >
                  {{ data.label.name }}
                </div>
                <div class="list-group-item">
                  <div class="p-2" v-for="(innerLabel,index) in data.scannedData" :key="index">
                    <div class="card-header mb-1 p-2" :style="'background:' + data.label.color + '; color: white'" >
                      {{ innerLabel.name }}
                    </div>
                    <li class="list-group-item mb-1">{{ innerLabel.text }}</li>
                  </div>
                </div>
            </div>
            <div v-else class="mt-2">
              <div class="card-header mb-1" :style="'background:' + data.label.color + '; color: white'" >
                {{ data.label.name }}
              </div>
              <li class="list-group-item mb-1">{{ data.scannedData }}</li>
            </div>
          </div>
        </div>
        <div class="d-flex justify-content-center align-items-center" v-if="scanLoading">
          <div class="loader-line"></div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect';
import Attachments from '../components/Attachments.vue';
import JsonCSV from 'vue-json-csv';
// import JsonExcel from 'vue-json-excel';

export default {
    name: "Main",
    components: {
        Multiselect,
        Attachments,
        'download-csv': JsonCSV,
        // 'download-excel': JsonExcel,
    },
    data(){
        return {
            allDocuments: {},
            selectedDocument: {},
            companies: [],
            selectedCompany: null,

            imageObj: null,
            ctx: null,
            canvas: null,

            showDropdown: false,

            selectedFilters: [],
            multiselectOptions: [],
            queries: [],

            exportDataButton: false,
            json_data: [],
            csvName: 'default.csv',
            excelName: 'default.xls',

            scanLoading: false,
            filterResult: false,
            cropedData: [],

            autoFiltered: false,
            attachments: null,

            showSelectScanButton: false,
            scannedIndexes: [],
        }
    },

    computed: {
      getComputedLabels(){
        if(this.selectedCompany == null) return [];
        return this.selectedCompany.labels.map((label) => {
          return label.name;
        })
      },

      getTrainedCompanies(){
        return this.companies.filter(company => company.labels != 0)
      }
    },

    watch: {
        selectedFilters: function(newVal, oldVal) {
            if(newVal.length < oldVal.length){
              this.init()
            }
            this.drawLabels()
            if(newVal.length > 0){
                this.showSelectScanButton = true;
            }else {
                this.showSelectScanButton = false;
            }
        },

        selectedCompany: function(){
            this.selectedFilters = [];
            this.clearCanvas();
            this.clearImages();
        }
    },

    methods: {
      downloadData(){
        let documemntId = this.allDocuments.map(document => document._id)

        this.axios.post('/documents/download/', { documemntId
                }
        ).then(res=>{

          var link = document.createElement('a');
          link.href = `http://localhost:3000/zip/${res.data.zip}`;
          link.download = res.data.zip;
          link.click();

          console.log(res)
        }).catch(e=>{
          console.log(e)

          console.log('FAILURE!!')
        });
      },
        exportFilters(type){
            switch(type){
                case 'txt':
                    this.downloadTxt();
                    break;
                case 'csv':
                    this.downloadCsv();
                    break;
                case 'json':
                    this.downloadJson();
                    break;
                case 'xls':
                    this.downloadExcel();
                    break;
            }
        },

        downloadTxt(){
            this.showDropdown = false;

            let filePath = this.textExport();
            let link = document.createElement('a');
            link.href = filePath;
            link.download = this.getFileName('txt');
            link.click()
        },
        downloadExcel(){
          this.showDropdown = false;
          if(!this.attachments.length) return;

          this.excelName = this.getFileName('xls');
          this.calculateJson();
        },

        downloadCsv(){
            this.showDropdown = false;
            if(!this.attachments.length) return;

            this.csvName = this.getFileName('csv');
            this.calculateJson();
        },

        downloadJson(){
            this.showDropdown = false;
            if(!this.attachments.length) return;

            this.calculateJson();
            let filename = this.getFileName('json');

            const json = JSON.stringify(this.json_data);
            const dataURL = `data:application/json,${json}`;

            let anchor = document.createElement('a');
            anchor.setAttribute("download", `${filename}`);
            anchor.setAttribute("href", dataURL);
            anchor.click()
        },
        calculateJson(){
            this.json_data = []
            let obj = {}
            this.selectedDocument.cropedData.forEach(crop => {
                obj = {[crop.label.name] : crop.scannedData , ...obj}
            })
            this.json_data.push({...obj})
        },
        getFileName(ext){
            const date = new Date()
            let today = date.toISOString().slice(0, 10)
            return `Document-${today}-${Date.now()}.${ext}`
        },
        textExport(){
            if (this.selectedDocument.cropedData == null){
                return
            }
            let exportData = this.selectedDocument.cropedData.map(crop => {
                return crop.scannedData
            })

            let data = new Blob([exportData], {type: 'text/plain'});

            // If we are replacing a previously generated file we need to
            // manually revoke the object URL to avoid memory leaks.
            if (this.textFile !== null) {
                window.URL.revokeObjectURL(this.textFile);
            }

            this.textFile = window.URL.createObjectURL(data);

            return this.textFile;
        },

        scanFilters(index = 0){
            this.drawLabels();
            this.scanLoading = true;
            if(index == 0){
                this.scannedIndexes = [];
            }

            this.axios.post(`/documents/${this.allDocuments[index]._id}/companies/${this.selectedCompany._id}`, { filters: this.selectedFilters })
                .then(res => {
                  console.log(res)
                    this.allDocuments[index].cropedData = res.data;
                    this.scannedIndexes.push(index);
                    this.exportDataButton = true;
                    if (this.allDocuments.length != index + 1) {
                        this.scanFilters(index + 1)
                    }
                }).catch(e => {
                    console.log(e)
                }).finally(() => this.scanLoading = false)
        },

        drawLabels(){
          this.selectedFilters.forEach( (filter) => {
              const label = this.selectedCompany.labels.find((label) => label.name == filter)
              this.selectLabel(label, false);
              if(label.innerLabels){
                label.innerLabels.map(innerLabel => {
                  this.selectLabel(innerLabel, false);
                })
              }
          });
        },

        selectedImg(index){
            let document = this.allDocuments[index]
            this.selectedDocument = document
            this.selectedFilters = this.selectedDocument.cropedData ? this.selectedDocument.cropedData.map((crop) => {
                return crop.label.name;
            }) : [];
            this.init()
            this.drawLabels();
        },

        attachesChanged(data){
            this.attachments = data
            this.selectedFilters = []
            this.clearCanvas()
        },

        uploadDocuments(){
            let formData = new FormData()

            this.attachments.forEach(file => {
                formData.append(`files`, file[1])
            })
            formData.append('companyId', this.selectedCompany._id);

            this.axios.post('/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            ).then(res=>{
                this.allDocuments = res.data
                this.selectedDocument = res.data[0]
                this.filterResult = true
                this.init()
            }).catch(e=>{
                console.log(e)

                console.log('FAILURE!!')
            });
        },

        init() {
            this.canvas = document.getElementById('canvas');
            this.ctx = this.canvas.getContext('2d');
            this.imageObj = new Image();
            this.imageObj.src = `http://localhost:3000/documents/${this.selectedDocument.filename}`;
            this.imageObj.onload =  () => { this.ctx.drawImage(this.imageObj, 0, 0, this.imageObj.naturalWidth, this.imageObj.naturalHeight, 0, 0, this.canvas.width , this.canvas.height ) };
        },

        clearCanvas(bg = false){
          if(bg){
            this.init();
          }else{
            this.canvas = document.getElementById('canvas');
            this.ctx = this.canvas.getContext('2d');
            this.ctx.fillStyle = 'white';
            this.ctx.fillRect(0, 0, 650, 920);
          }
        },

        addLabel(){
            if(this.newLabel != ''){
                if(!this.colorPalete.hex){
                    this.color = '#2F2E41';
                }else{
                    this.color = this.colorPalete.hex;
                }
                this.labels.push({
                    name: this.newLabel,
                    rect: { ...this.rect },
                    color: this.color
                })
                this.newLabel = '';
                this.addNewLabel = false;
                this.labelsUpdated = false;
            }else{
                window.alert('You have to name a label')
            }
        },

        saveLabels(){
            this.axios.put( '/train/'+this.selectedCompany._id, {
                name: this.selectedCompany.name,
                companyId: this.selectedCompany._id,
                labels: this.labels,
                color: this.color
            })
            .then(res=>{
                this.labelsUpdated = true;
                console.log(res);
            }).catch(e=>{
                console.log(e);
                console.log('FAILURE!!');
            });
        },

        selectLabel(label, clearable = true){
          if(clearable){
            this.ctx.clearRect(0, 0, 650, 920);
            this.ctx.drawImage(this.imageObj, 0, 0, this.imageObj.naturalWidth, this.imageObj.naturalHeight, 0, 0, this.canvas.width , this.canvas.height);
          }
          this.ctx.lineWidth = "4";
          this.ctx.strokeStyle = label.color ?? "rgb(47, 46, 65)";
          this.ctx.strokeRect(label.rect.startX, label.rect.startY, label.rect.w, label.rect.h);
        },

        showAllLabels(){
            this.selectedFilters = this.getComputedLabels
            this.selectedCompany.labels.forEach((label)=>{
              this.selectLabel(label, false);
              if(label.innerLabels){
                label.innerLabels.map(innerLabel => {
                  this.selectLabel(innerLabel, false);
                })
              }
            });
        },

        fetchCompanies(){
            this.axios.get('/companies')
            .then(res => {
                this.companies = res.data.company
            })
            .catch(e => {
                console.log(e)
            })
        },

        clearImages(){
            this.attachments = [];
            this.selectedFilters = [];
            this.clearCanvas();
        }
    },

    mounted() {
      this.fetchCompanies()
    },
}
</script>

<style scoped>
.custom-container{
  margin: 0 100px;
}
.btn-primary {
  background: rgb(47, 46, 65) !important;
  border-color: rgb(47, 46, 65) !important;
}
.btn-primary:focus {
  border-color: rgb(47, 46, 65) !important;
}
.pointer {
  cursor: pointer;
}

.custom-file-label {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

button:focus {
  outline: 0 !important;
  box-shadow: none;
}
.multiselect {
  font-size: 14px;
}
.custom-control-input:checked,
.custom-control-label::after {
  border-color: rgb(47, 46, 65);
  background-color: rgb(47, 46, 65);
}
.custom-control-input:checked ~ .custom-control-label::before {
  color: #fff;
  border-color: rgb(47, 46, 65);
  background-color: rgb(47, 46, 65);
}
.pointer {
  cursor: pointer;
}

.loader-line {
  width: 300px;
  height: 3px;
  position: relative;
  overflow: hidden;
  background-color: #ddd;
  margin: 100px auto;
  -webkit-border-radius: 20px;
  -moz-border-radius: 20px;
  border-radius: 20px;
}
.loader-line:before {
  content: "";
  position: absolute;
  left: -50%;
  height: 3px;
  width: 5%;
  background-color: rgb(47, 46, 65);
  -webkit-animation: lineAnim 4s linear infinite;
  -moz-animation: lineAnim 4s linear infinite;
  animation: lineAnim 4s linear infinite;
  -webkit-border-radius: 20px;
  -moz-border-radius: 20px;
  border-radius: 20px;
}

@keyframes lineAnim {
  0% {
    left: -20%;
  }
  50% {
    left: 20%;
    width: 80%;
  }
  100% {
    left: 100%;
    width: 100%;
  }
}
.left-data {
  margin-right: 120px;
}
@media (max-width: 414px) {
  canvas {
    width: 270px;
    height: 450px;
  }
  .custom-container{
    margin: 0 10px;
  }
  .left-data {
    margin-right: 0 !important;
  }
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
