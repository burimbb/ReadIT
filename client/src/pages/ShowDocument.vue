<template>
    <div class="container">
        <div class="row mt-5 mb-5">
            <div class=" col-lg-5 p-4 mb-5">
                <div  class="mt-5">
                    <div class="align-items-center">
                        <div>
                            <h4 class="mb-4">Filter Result</h4>
                        </div>

                        <div class="d-flex justify-content-between">
                            <button class="btn btn-primary" @click="showAllLabels()">Show All Labels</button>

                            <div class="dropdown ml-3">
                                <button class="btn btn-primary dropdown-toggle" type="button" @click="showDropdown = !showDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Export as
                                </button>
                                <div class="main-con-filter" @click="showDropdown = !showDropdown" v-if="showDropdown"></div>

                                <div class="dropdown-menu show" v-show="showDropdown">
                                    <a class="dropdown-item pointer" @click="exportFilters('txt')">
                                        <i class="fa fa-file-text-o mr-2" aria-hidden="true"></i>
                                        Txt File
                                    </a>
                                    <download-csv
                                            :data="json_data" :name="csvName">
                                        <a class="dropdown-item pointer" @click="exportFilters('csv')">
                                            <i class="fa fa-file-o mr-2" aria-hidden="true"></i>
                                            Csv File
                                        </a>
                                    </download-csv>
                                    <a class="dropdown-item pointer" @click="exportFilters('json')">
                                        <i class="fa fa-file mr-2" aria-hidden="true"></i>
                                        Json File
                                    </a>
                                    <a class="dropdown-item pointer" @click="downloadData()">
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
                                placeholder="Select Filters">
                        </multiselect>
                    </div>
                    <div class="text-right">
                        <button type="button" class="btn btn-outline-danger" @click="deleteDocument(documents._id)" >
                            <i class="fa fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="shadow" v-for="(label, index) in getSelectedFiltersObj"  :key="index">
                    <div class="card-header mb-1 mt-2" :style="'background:'+label[0].color+'; color: white'">{{label[0].name}}</div>
                    <p v-if="label[0].innerLabels.length == 0" class="p-3"> {{ label[0].text }} </p>
                    <div v-if="label[0].innerLabels.length > 0">
                        <div class="p-3" v-for="(innerLabel, index) in label[0].innerLabels"  :key="index">
                            <p class="p-2" :style="'background:'+label[0].color+'; color: white'"> {{ innerLabel.name }} </p>
                            <p class="p-1"> {{ innerLabel.text }} </p>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <canvas class="shadow m-5" id="canvas" width="650" height="920"></canvas>
            </div>
        </div>

    </div>
</template>

<script>
    import Multiselect from "vue-multiselect";
    import JsonCSV from "vue-json-csv";

    export default {
        name: "ShowDocument",
        components: {
            Multiselect,
            'download-csv': JsonCSV,
        },
        data(){
            return {
                documents : {
                    name: '',
                    filename: '',
                    labels: [],
                },
                showDropdown: false,
                selectedFilters: [],
                json_data: [],
                csvName: 'default.csv',
                excelName: 'default.xls',
            }
        },
        computed: {
            getComputedLabels(){
                if(this.documents == null) return []
                return this.documents.labels.map((label) => {
                    return label.name
                })
            },
            getSelectedFiltersObj(){
                return this.selectedFilters.map((filter)=>{
                        const label = this.documents.labels.find((label) => label.name == filter)

                        this.drawLabel(label, false);
                            return this.documents.labels.filter(label => {
                                return label.name == filter
                            })
                });
            }
        },

        watch: {
            selectedFilters: function() {
                this.selectedFilters.forEach((filter)=>{
                    const label = this.documents.labels.find((label) => label.name == filter)
                    this.drawLabel(label, false);
                    if(label.innerLabels){
                        label.innerLabels.map(innerLabel => {
                            this.drawLabel(innerLabel, false);
                        })
                    }
                });

            },

            selectedCompany: function(){
                this.selectedFilters = [];
                this.clearCanvas();
                this.clearImages();
            }
        },
        methods:{
            showDocuments(){
                this.axios.get('/documents/' +this.$route.params.id).then(res => {
                        console.log(res)
                        this.documents = res.data.docs
                    this.init()
                    }
                ).catch(() => {

                });
            },
            drawLabel(label, clearable = true){
                if(clearable){
                    this.ctx.clearRect(0, 0, 650, 920);
                    this.ctx.drawImage(this.imageObj, 0, 0, this.imageObj.naturalWidth, this.imageObj.naturalHeight, 0, 0, this.canvas.width , this.canvas.height);
                }
                this.ctx.lineWidth = "4";
                this.ctx.strokeStyle = label.color;
                this.ctx.strokeRect(label.rect.startX, label.rect.startY, label.rect.w, label.rect.h);
            },

            init() {
                this.canvas = document.getElementById('canvas');
                this.ctx = this.canvas.getContext('2d');
                this.imageObj = new Image();
                this.imageObj.src = `http://localhost:3000/documents/${this.documents.filename}`;
                this.imageObj.onload =  () => { this.ctx.drawImage(this.imageObj, 0, 0, this.imageObj.naturalWidth, this.imageObj.naturalHeight, 0, 0, this.canvas.width , this.canvas.height ) };
            },

            clearCanvas(){
                this.canvas = document.getElementById('canvas');
                this.ctx = this.canvas.getContext('2d');
                this.ctx.fillStyle = 'white';
                this.ctx.fillRect(0, 0, 650, 920);
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
                this.ctx.strokeStyle = label.color;
                this.ctx.strokeRect(label.rect.startX, label.rect.startY, label.rect.w, label.rect.h);
            },

            showAllLabels(){
                this.selectedFilters = this.getComputedLabels
            },
            deleteDocument (id){
                this.axios.delete('/document/'+ id)
                    .then(() => {
                        this.$delete(id)
                        this.$router.push('/documents');
                    }).catch(e => {
                    console.log(e)
                });
            },
            downloadData(){
                console.log(this.documents)

                this.axios.post('/documents/download/', {
                    documemntId: this.documents._id
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

                this.csvName = this.getFileName('csv');
                this.calculateJson();
            },

            downloadJson(){
                this.showDropdown = false;
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
                this.documents.labels.forEach(label => {
                    obj = {[label.name] : label.text , ...obj}
                })
                this.json_data.push({...obj})
            },
            getFileName(ext){
                const date = new Date()
                let today = date.toISOString().slice(0, 10)
                return `Document-${today}-${Date.now()}.${ext}`
            },
            textExport(){
                if (!this.documents.labels){
                    return
                }
                let exportData = this.documents.labels.map(label => {
                    return label.text
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

        },
        mounted() {
            this.showDocuments();
        }
    }
</script>

<style scoped>
    .btn-primary{
        background: rgb(47, 46, 65) !important;
        border-color: rgb(47, 46, 65) !important;
    }
    .btn-primary:focus{
        border-color: rgb(47, 46, 65) !important;
    }
</style>
