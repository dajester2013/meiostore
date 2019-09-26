import StateModel from "./StateModel";

/**
 * State Storage Base Class
 * 
 * @abstract
 */
export class StateStore {

	constructor() {
		this.disposers = [];
		this.readFromStore = this.readFromStore.bind(this);
		this.writeToStore = this.writeToStore.bind(this);
	}

	async loadModel() {
		let state = await this.readFromStore();
		let model = new StateModel(state);
		
		this.disposers.push(model.addObserver(this.writeToStore));

		return model;
	}

	/**
	 * Bind a model to this state storage
	 * @param {StateModel} model The model to bind to
	 */
	bindModel(model) {
		model.update(state=>{
			state.LoadingStateFromStorage = true;
			return state;
		});



		this.readFromStore().then((state)=>{
			model.update(()=>state);

			this.disposers.push(model.addObserver(this.writeToStore));
		});
	}

	dispose() {
		this.disposers.map(dispose=>dispose());
	}

	/**
	 * Close this state storage - if you override this, be sure to call this.dispose()
	 * @returns void
	 */
	close() {
		this.dispose();
	}

	/**
	 * Synchronizes state from the model to the storage
	 * @abstract
	 * @param {*} state The current state to be written to the store
	 */
	async writeToStore(state) {}
	
	/**
	 * Reads state from the storage, to be applied to the model
	 * @abstract
	 * @returns {*}
	 */
	async readFromStore() {}

}

/**
 * State store backed by localStorage
 * @see StateStorage
 */
export class LocalStateStorage extends StateStore {

	constructor(storageKey = "state") {
		super();
		this.storageKey = storageKey;
	}

	/** 
	 * @see StateStorage#writeToStore
	 */
	async writeToStore(state) {
		window.localStorage.setItem(this.storageKey, JSON.stringify(state));
	}

	/** 
	 * @see StateStorage#readFromStore
	 */
	async readFromStore() {
		let state = JSON.parse(window.localStorage.getItem(this.storageKey));
		return state;
	}

}