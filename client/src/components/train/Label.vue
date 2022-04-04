<template>
    <div>
        <p class="font-weight-bold">Label Name:</p>
        
        <div class="d-flex justify-content-between">
            <p class="pointer ml-2 m-0 align-self-center" v-text="label.name" @click="selectLabel(label)"></p>

            <div class="form-check text-right">
                <i class="fa fa-caret-down fa-2x pointer" @click="checkMain()" v-if="!addNewInnerLabel"></i>
                <i class="fa fa-caret-up fa-2x pointer" @click="checkMain()" v-else></i>
                <!-- <input class="form-check-input pointer" type="checkbox" v-model="addNewInnerLabel"  @click="checkMain()">
                <label class="form-check-label pointer" for="defaultCheck1">
                    Main Label
                </label> -->
            </div>
        </div>

        <div class="inner-label ml-4" v-if="addNewInnerLabel">
            <div class="my-2 pt-1">
                <div v-if="label.innerLabels">
                    <p class="font-weight-bold">InnerLabels:</p>
                    <div v-for="(innerLabel, index) in label.innerLabels" :key="index">
                        <div>
                            <p class="pointer ml-2" v-text="innerLabel.name"></p>
                        </div>
                        
                        <!-- <hr v-if="index + 1 != innerLabels.length"> -->
                        <hr>
                    </div>
                </div>
                <!-- <div class="d-flex justify-content-between mt-5">
                    <button class="btn btn-primary text-white" @click="showAllLabels()">Show All Labels</button>
                    <button class="btn btn-primary text-white" :disabled="labelsUpdated" @click="saveLabels()">Save Labels</button>
                </div> -->
            </div>

            <div>
                <div class="form-group row">
                    <label for="innerlabel" class="col-sm-4 col-form-label">Inner Label:</label>
                    
                    <div class="col-sm-8">
                        <input type="text" id="name" v-model="newInnerLabel" class="form-control"/>
                    </div>
                </div>

                <div class="form-group row">
                    <label for="innerlabel" class="col-sm-4 col-form-label">Extra Fields:</label>
                    
                    <div class="col-sm-8">
                        <multiselect
                            v-model="selectedExtraFields"
                            :options="multiselectOptions"
                            :close-on-select="false"
                            :multiple="true"
                            placeholder="Select Extra Fields"></multiselect>
                    </div>
                </div>
                
                <div class="d-flex justify-content-between align-items-center">
                    <div class="w-50">
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="inputGroupPrepend2">Rows: </span>
                            </div>
                            <input type="number" class="form-control" v-model="duplicateRows">
                        </div>
                    </div>

                    <div>
                        <button class="btn btn-primary text-white" @click="addInnerLabel(label)">Add InnerLabel</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Multiselect from 'vue-multiselect';

export default {
    props: ["checked", "data"],

    components: {
        Multiselect
    },

    data(){
        return {
            label: this.data,

            newInnerLabel: "",
            addNewInnerLabel: false,
            duplicateRows: 1,

            selectedExtraFields: [],
            multiselectOptions: ['ID','Price'],
        }
    },

    watch: {
        checked(newVal){
            this.addNewInnerLabel = newVal;
        }
    },

    methods: {
        addInnerLabel(){
            if(this.newInnerLabel != ''){
                if(this.duplicateRows > 0){
                    this.$emit("added", this.label, this.newInnerLabel, this.selectedExtraFields, this.duplicateRows);
                    this.duplicateRows = 1;
                    this.selectedExtraFields = [];
                }else{
                    this.$emit("added", this.label, this.newInnerLabel, this.selectedExtraFields);
                    this.selectedExtraFields = [];
                }

                this.newInnerLabel = '';
            }
        },

        checkMain(){
            this.addNewInnerLabel = !this.addNewInnerLabel;

            this.$emit("checked", this.addNewInnerLabel)
        },
    },
}
</script>
<style lang="css" scoped>
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
</style>