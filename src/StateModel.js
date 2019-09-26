/*
 * A basic state container that follows the Meiosis pattern https://meiosis.js.org/
 */
import {stream, scan} from "flyd";
import deepmerge from "deepmerge";

const SymUpdateStream = Symbol();
const SymStateStream = Symbol();

export default class StateModel {

	constructor(initialState = {}) {
		this[SymUpdateStream] = stream();
		this[SymStateStream] = scan((...args)=>this.onUpdate(...args), initialState, this[SymUpdateStream]);

		this.errors = stream();
	}

	update(...updates) {
		this[SymUpdateStream](...updates);
		return this.model;
	}

	onUpdate(model, update) {
		if (typeof update == "function") {
			let result = update(model)||model;
			return result;
		} else if (typeof update == "object") {
			if (!update.prototype || update.prototype === Object)
				return deepmerge(model, update);
		}
	}

	get model() {
		return this[SymStateStream]();
	}

	/**
	 * Adds an observer to the store's state
	 * @param {Function} observer A function called whenever state is modified, and receives the current state
	 * @returns {Function} dispose Call this to dispose of the observer
	 */
	addObserver(observer) {
		let state = this[SymStateStream];
		let stream = state.map(observer);

		// return a function that disposes the observer
		return Object.assign(()=>{
			// make it garbage-collectable
			stream.deps.length=0;
			// remove the intermediate stream from the statestream listeners
			state.listeners.splice(state.listeners.indexOf(stream), 1);
		}, {
			stream:stream
		});
	}

}