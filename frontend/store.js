import create from "zustand"

export const useStore = create(
    (set, get) => ({
        options: [],
        title: "",
        description: "",
        uploading:false,
        //options
        addOption: (option) => set(state => ({ options: [...state.options, option] })),//{ pool: {options: get().pool.options + 1} }
        getOptions: () => get().options,
        removeLastOption: () => set(state => state.options.pop()),
        updateOptionText: (option) => set(state => (state.options.find(o => o.id === option.id).text = option.text)),
        clearOptions: () => set({ options: [] }),
        //cache
        setCachedState: (cache) => set(({ options: [...cache.options], title: cache.details.title, description: cache.details.description })),
        //other
        setUploading: (uploading) => set({ uploading }),
        setTitle: (title) => set(({ title: title })),
        getTitle: () => get().title,
        setDescription: (description) => set(({ description: description })),
        getDescription: () => get().description,
        //clear state
        clearAllStoreState: () => set({ options: [], title: "", description: "", editMode: true })
    }),
)
