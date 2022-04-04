<template>
    <div class="container">
        <div class="row">
            <div class="col-md-4 mt-5">
                <div class="form-group">
                    <label>First Select a Company</label>
                    <select class="form-control" v-model="selectedCompany">
                        <option v-for="company in companies" :key="company.id" class="dropdown-item" :value="company">{{ company.name }}</option>
                    </select>
                    <div v-show="selectedCompany" class="input-group mt-3">
                        <div class="custom-file">
                            <input type="file" ref="file" class="custom-file-input" id="attachmentsgroup" @change="handleFileUpload" accept="image/x-png,image/gif,image/jpeg" multiple>
                            <label class="custom-file-label" for="attachmentsgroup" v-text="choseFileLabel"></label>
                        </div>
                        <div class="input-group-append">
                            <button class="btn btn-outline-danger" type="button" id="inputGroupFileAddon04" @click="clearImages()">Clear</button>
                        </div>
                    </div>
                </div>
                <div v-show="browseFile" class="text-right">
                    <button class="btn btn-primary" :disabled="fileUploaded" @click="submitFile()">Upload</button>
                </div>

                <div v-if="loading" class="loader-line"></div>

                <div v-if="addNewLabel">
                    <div class="form-group mt-5">
                        <div>
                            <label for="name">Label:</label>
                            <input type="text" id="name" v-model="newLabel" class="form-control"/>
                            <p v-if="errors"><small class="text-danger">You have to write a label name</small></p>
                        </div>
                        <swatches-picker class="mt-3 w-100" v-model="colorPalete"></swatches-picker>
                        <div class="text-right">
                            <button class="btn btn-primary mt-3 mr-3" @click="cancelLabel()">Cancel</button>
                            <button class="btn btn-primary mt-3" @click="addLabel()">Add Label</button>
                        </div>
                    </div>
                </div>

                <div v-if="labels.length && !addNewLabel" class="my-5">
                    <div ref="inner-labels" v-for="(label, index) in labels" :key="index">
                        <label-component :checked="checkedInnerLabel == index" :data="label" @checked="innerLabelChecked($event, index)" @added="addNewInnerLabel"></label-component>
                        <hr>
                    </div>
                    <div class="d-flex justify-content-between mt-5">
                        <button class="btn btn-primary text-white" @click="showAllLabels()">Show All Labels</button>
                        <button class="btn btn-primary text-white" :disabled="labelsUpdated" @click="saveLabels()">Save Labels</button>
                    </div>
                </div>
            </div>
            <div>
                <canvas class="shadow m-5"  id="canvas" width="650" height="920"></canvas>
            </div>
        </div>
    </div>
</template>

<script>
import { Swatches } from 'vue-color';
import Label from '../components/train/Label.vue';

export default {
    name: "Train",
    components: {
        'swatches-picker': Swatches,
        'label-component': Label,
    },
    data(){
        return {
            file: '',
            browseFile: false,
            fileUploaded: false,
            currentDocument: {},
            companies: [],
            selectedCompany: null,
            loading: false,

            rect : {
                startX:0,
                startY:0,
                w:0,
                h:0,
            },
            drag : false,
            imageObj : null,
            ctx: null,
            canvas:null,

            addNewLabel: false,
            newLabel:'',
            labels: [],
            labelsUpdated: false,

            color: '',
            colorPalete: [],

            showDropdownBtn: false,
            showDropdown: false,

            choseFileLabel: "Choose file",

            checkedInnerLabel: -1,

            errors: false
        }
    },
    methods: {
        handleFileUpload(event){
            this.file = this.$refs.file.files[0];

            if(event.target.files.length > 1){
                this.choseFileLabel = "Selected "+event.target.files.length+" images"
            }else{
                this.choseFileLabel = event.target.files[0].name
            }
            this.browseFile = true;
        },

        submitFile(){
            let formData = new FormData();
            formData.append('files', this.file);
            formData.append('companyId', this.selectedCompany._id);
            this.loading = true

            this.axios.post('/upload/train', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }

            ).then(res=>{
                this.currentDocument = res.data
                this.init()
                this.showDropdownBtn = true
                this.fileUploaded = true
            }).catch(()=>{
                console.log('FAILURE!!')
            }).finally(()=> this.loading = false);
        },

        addNewInnerLabel(label, newInnerLabel, extraFields = [], duplicate = 1){
            let currentLabel = this.labels.find((item) => item.name == label.name);

            if(!currentLabel.innerLabels){
                currentLabel.innerLabels = []
            }

            for(let i = 0; i < duplicate; i++){
                let temp = {
                    name: newInnerLabel,
                    rect: { ...this.rect },
                    color: this.color
                };

                if(i == 0){
                    temp.name += ' #0'
                }

                if(i != 0){
                    temp.rect.startY += i * temp.rect.h;
                    temp.name += ' #'+i;
                    currentLabel.innerLabels.push(temp);

                    if(extraFields.includes("ID")){
                        let productId = {
                            name: newInnerLabel+' #ID #'+i,
                            rect: { ...temp.rect },
                            color: this.color
                        };
                        productId.rect.w = temp.rect.startX - currentLabel.rect.startX;
                        productId.rect.startX = currentLabel.rect.startX;
                        currentLabel.innerLabels.push({...productId});
                    }
                    if(extraFields.includes("Price")){
                        let productPrice = {
                            name: newInnerLabel+' #Price #'+i,
                            rect: { ...temp.rect },
                            color: this.color
                        };
                        productPrice.rect.w = (currentLabel.rect.startX + currentLabel.rect.w) - (temp.rect.startX + temp.rect.w);
                        productPrice.rect.startX = temp.rect.startX + temp.rect.w;
                        currentLabel.innerLabels.push({...productPrice});
                    }
                }else{
                    currentLabel.innerLabels.push(temp);

                    if(extraFields.includes("ID")){
                        let productId = {
                            name: newInnerLabel+' #ID #'+i,
                            rect: { ...temp.rect },
                            color: this.color
                        };
                        productId.rect.w = temp.rect.startX - currentLabel.rect.startX;
                        productId.rect.startX = currentLabel.rect.startX;
                        currentLabel.innerLabels.push({...productId});
                    }
                    if(extraFields.includes("Price")){
                        let productPrice = {
                            name: newInnerLabel+' #Price #'+i,
                            rect: { ...temp.rect },
                            color: this.color
                        };
                        productPrice.rect.w = (currentLabel.rect.startX + currentLabel.rect.w) - (temp.rect.startX + temp.rect.w);
                        productPrice.rect.startX = temp.rect.startX + temp.rect.w;
                        currentLabel.innerLabels.push({...productPrice});
                    }
                }
            }

            this.labelsUpdated = false;
        },

        innerLabelChecked(event, index){
            if(event){
                this.checkedInnerLabel = index;
                this.selectLabel(this.labels[this.checkedInnerLabel], true);
            }else{
                this.checkedInnerLabel = -1;
            }
        },

        init() {
            this.canvas = document.getElementById('canvas');
            this.ctx = this.canvas.getContext('2d');
            this.imageObj = new Image();
            this.imageObj.src = `http://localhost:3000/trained/${this.currentDocument.filename}`;
            this.imageObj.onload =  () => { this.ctx.drawImage(this.imageObj, 0, 0, this.imageObj.naturalWidth, this.imageObj.naturalHeight, 0, 0, this.canvas.width , this.canvas.height ) };
            this.canvas.addEventListener('mousedown', this.mouseDown, false);
            this.canvas.addEventListener('mouseup', this.mouseUp, false);
            this.canvas.addEventListener('mousemove', this.mouseMove, false);
        },

        mouseDown(e) {
            this.rect.startX = e.pageX - this.canvas.offsetLeft;
            this.rect.startY = e.pageY - this.canvas.offsetTop;
            this.drag = true;
        },

        mouseUp() {
            this.drag = false;

            if(this.checkedInnerLabel == -1){
                this.addNewLabel = true;
                this.errors = false;

            }
        },

        mouseMove(e) {
            if (this.drag) {
                this.ctx.clearRect(0, 0, 650, 920);
                this.ctx.drawImage(this.imageObj, 0, 0, this.imageObj.naturalWidth, this.imageObj.naturalHeight, 0, 0, this.canvas.width , this.canvas.height );
                this.rect.w = (e.pageX - this.canvas.offsetLeft) - this.rect.startX;
                this.rect.h = (e.pageY - this.canvas.offsetTop) - this.rect.startY;
                this.ctx.lineWidth = "4";
                this.ctx.strokeStyle = '#64eb34';
                this.ctx.strokeRect(this.rect.startX, this.rect.startY, this.rect.w, this.rect.h);
                if(this.checkedInnerLabel != -1){
                    this.selectLabel(this.labels[this.checkedInnerLabel], false);
                }
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
                this.errors = true;
            }
        },
        cancelLabel(){
            this.newLabel = '';
            this.addNewLabel = false;
            this.labelsUpdated = true;
            this.init();
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
            this.labels.forEach((label)=>{
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
          this.choseFileLabel = "Choose file"
          this.fileUploaded = false
        }
    },
    mounted() {
        this.fetchCompanies()
    },
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
    .pointer{
        cursor: pointer;
    }

    .custom-file-label{
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
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
    .vc-swatches{
        height: 150px;
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
</style>
