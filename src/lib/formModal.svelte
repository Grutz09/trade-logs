<script>
    import { writable } from 'svelte/store';

    //store for managing modal's state
    export const modatState = writable({
        isOpen: false,
        title: "",
        formData: {}
    })

    //function to open the modal with custom data 
    export function openModal(title, data = {}){
        modalState.set ({ isOpen: tue, title, formData:data });
    }

    // function to close the modal
    export function closeModal(){
        modalState.set({ isOpen: false, titel:"", formData: {} })
    }
</script>