<template>
    <div>
        <div :class="{'d-flex justify-content-between align-items-center p-1 ': true, 'borderLabel': selectedLabelId != null ? currentLabel._id == selectedLabelId : false}">
            <p class="pointer ml-2 m-0" v-text="currentLabel.name" @click="$emit('selected-label', currentLabel)" v-if="!isEditing"></p>
            <input type="text" name="editLabelName" v-model="editLabelName" v-else>

            <div v-if="!isEditing">
                <button class="btn btn-sm btn-primary mr-2" @click="editLabel(currentLabel, index)">Edit</button>
                <button class="btn btn-sm btn-primary" @click="removeLabel()">Delete</button>
            </div>
            <div v-else>
                <button class="btn btn-sm btn-primary mr-2" @click="updateLabel()">Update</button>
                <button class="btn btn-sm btn-primary mr-2" @click="cancelLabel()">Cancel</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['data', 'index', 'isEditing', 'selectedLabelId'],


    data(){
        return {
            currentLabel: this.data,
            editLabelName: this.data.name,
        }
    },

    watch: {
        data(newVal){
            this.currentLabel = newVal
            this.editLabelName = newVal.name
        }
    },

    methods: {
        editLabel(label, index){
            this.$emit('selected-label', this.currentLabel);
            this.$emit("editing-label", index);
            this.editingLabel = index;
            this.editLabelName = label.name;
        },

        removeLabel(){
            this.$emit("removed-label", this.index);
        },

        updateLabel(){
            this.currentLabel.name = this.editLabelName;
            this.$emit('update-label', this.currentLabel);
        },

        cancelLabel(){
            this.$emit('cancel-update')
        },
    },
}
</script>

<style lang="css">
    .borderLabel{
        border: 1px solid rgb(47, 46, 65);
    }

    .btn-primary{
        background: rgb(47, 46, 65) !important;
        border-color: rgb(47, 46, 65) !important;
    }
    .btn-primary:focus{
        border-color: rgb(47, 46, 65) !important;
    }
</style>