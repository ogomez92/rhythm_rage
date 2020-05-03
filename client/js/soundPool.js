import { so } from './soundObject.js';

class SoundPoolItem {
	constructor(filename) {
		this.reset(filename);
	}

	reset(filename) {
		this.filename = filename;
		if (typeof handle !== 'undefined') {
			handle.destroy();
		}
		this.handle = so.create(filename);
		this.x = 0;
		this.y = 0;
		this.looping = false;
		this.pan_step = 0;
		this.volume_step = 0;
		this.behind_pitch_decrease = 0;
		this.start_pan = 0;
		this.start_volume = 100;
		this.start_pitch = 100;
		this.left_range = 0;
		this.right_range = 0;
		this.backward_range = 0;
		this.forward_range = 0;
		this.max_distance = 0;
		this.is_3d = false;
		this.paused = false;
		this.stationary = false;
		this.start_offset = 0;
		this.persistent = false;
	}

	position1d(lx, sx, ps, vs, start_pan = 0, start_volume = 100) {
		let delta = 0;
		let finalPan = start_pan;
		let finalVolume = start_volume;
		if (sx < lx) {
			delta = lx - sx;
			finalPan -= (delta * ps);
			finalVolume -= (delta * vs);
		}
		if (sx > lx) {
			delta = sx - lx;
			finalPan += (delta * ps);
			finalVolume -= (delta * vs);
		}
		if (finalPan < -100) {
			finalPan = -100;
		}
		if (finalPan > 100) {
			finalPan = 100;
		}
		if (finalVolume < 0) {
			finalVolume = 0;
		}
		if (this.handle.pan * 100 != finalPan) {
			this.handle.pan = finalPan / 100;
		}
		if (this.handle.volume * 100 != finalVolume) {
			this.handle.volume = finalVolume / 100;
		}
	}

	position2d(listener_x, listener_y, source_x, source_y, pan_step, volume_step, behind_pitch_decrease, start_pan = 0, start_volume = 100, start_pitch = 100) {
		let delta_x = 0;
		let delta_y = 0;
		let final_pan = start_pan;
		let final_volume = start_volume;
		let final_pitch = start_pitch;

		// First, we calculate the delta between the listener && the source.
		if (source_x < listener_x) {
			delta_x = listener_x - source_x;
			final_pan -= (delta_x * pan_step);
			final_volume -= (delta_x * volume_step);
		}
		if (source_x > listener_x) {
			delta_x = source_x - listener_x;
			final_pan += (delta_x * pan_step);
			final_volume -= (delta_x * volume_step);
		}
		if (source_y < listener_y) {
			final_pitch -= Math.abs(behind_pitch_decrease);
			delta_y = listener_y - source_y;
			final_volume -= (delta_y * volume_step);
		}
		if (source_y > listener_y) {
			delta_y = source_y - listener_y;
			final_volume -= (delta_y * volume_step);
		}

		// Then we check if the calculated values are out of range, && fix them if that's the case.
		if (final_pan < -100) {
			final_pan = -100;
		}
		if (final_pan > 100) {
			final_pan = 100;
		}
		if (final_volume < 0) {
			final_volume = 0;
		}
		if (this.handle.pan * 100 != final_pan) {
			this.handle.pan = final_pan / 100;
		}
		if (this.handle.volume * 100 != final_volume) {
			this.handle.volume = final_volume / 100;
		}
		if (this.handle.pitch * 100 != final_pitch) {
			this.handle.pitch = final_pitch / 100;
		}
	}

	update(listener_x, listener_y) {
		if (typeof this.handle === 'undefined') {
			return;
		}
		if (this.max_distance > 0 && this.looping == true) {
			const total_distance = this.get_total_distance(listener_x, listener_y);
			if (total_distance > this.max_distance && this.handle.active == true) {
				this.handle.destroy();
				return;
			}
			if (total_distance <= this.max_distance && this.handle.active == false) {
				this.handle = so.create(filename);
				if (this.handle.active == true) {
					if (this.start_offset > 0) {
						this.handle.seek(start_offset);
					}
					this.updateListenerPosition(listener_x, listener_y);
					if (this.paused == false) {
						this.handle.play();
						this.handle.loop = true;
					}
				}
				return;
			}
		}
		this.updateListenerPosition(listener_x, listener_y);
	}

	updateListenerPosition(listener_x, listener_y) {
		if (this.handle.active == false) {
			return;
		}
		if (this.stationary == true) {
			return;
		}
		const delta_left = this.x - this.left_range;
		const delta_right = this.x + this.right_range;
		const delta_backward = this.y - this.backward_range;
		const delta_forward = this.y + this.forward_range;
		let true_x = listener_x;
		let true_y = listener_y;
		if (this.is_3d == false) {
			if (listener_x >= delta_left && listener_x <= delta_right) {
				this.position1d(listener_x, listener_x, this.pan_step, this.volume_step, this.start_pan, this.start_volume);
				return;
			}
			if (listener_x < delta_left) {
				this.position1d(listener_x, delta_left, this.pan_step, this.volume_step, this.start_pan, this.start_volume);
			}
			if (listener_x > delta_right) {
				this.position1d(listener_x, delta_right, this.pan_step, this.volume_step, this.start_pan, this.start_volume);
			}
			return;
		}
		if (listener_x < delta_left) {
			true_x = delta_left;
		} else if (listener_x > delta_right) {
			true_x = delta_right;
		}
		if (listener_y < delta_backward) {
			true_y = delta_backward;
		} else if (listener_y > delta_forward) {
			true_y = delta_forward;
		}
		this.position2d(listener_x, listener_y, true_x, true_y, this.pan_step, this.volume_step, this.behind_pitch_decrease, this.start_pan, this.start_volume, this.start_pitch);
	}

	/*
	   This method returns the total distance between the current sound && the listener in space. This is used to calculate in && out of earshot conditions.
	 */
	get_total_distance(listener_x, listener_y) {
		if (this.stationary == true) {
			return 0;
		}
		const delta_left = this.x - this.left_range;
		const delta_right = this.x + this.right_range;
		const delta_backward = this.y - this.backward_range;
		const delta_forward = this.y + this.forward_range;
		let true_x = listener_x;
		let true_y = listener_y;
		let distance = 0;
		if (this.is_3d == false) {
			if (listener_x >= delta_left && listener_x <= delta_right) {
				return distance;
			}
			if (listener_x < delta_left) {
				distance = delta_left - listener_x;
			}
			if (listener_x > delta_right) {
				distance = listener_x - delta_right;
			}
			return distance;
		}
		if (listener_x < delta_left) {
			true_x = delta_left;
		} else if (listener_x > delta_right) {
			true_x = delta_right;
		}
		if (listener_y < delta_backward) {
			true_y = delta_backward;
		} else if (listener_y > delta_forward) {
			true_y = delta_forward;
		}
		if (listener_x < true_x) {
			distance = (true_x - listener_x);
		}
		if (listener_x > true_x) {
			distance = (listener_x - true_x);
		}
		if (listener_y < true_y) {
			distance += (true_y - listener_y);
		}
		if (listener_y > true_y) {
			distance += (listener_y - true_y);
		}
		return distance;
	}
}

class SoundPool {
	// Default constructor, where we give the user 100 sounds.
	constructor() {
		this.items = [];
		this.items.splice();
		this.max_distance = 0;
		this.pan_step = 1.0;
		this.volume_step = 1.0;
		this.behind_pitch_decrease = 0.25;
		this.last_listener_x = this.x;
		this.last_listener_y = 0;
		this.highest_slot = 0;
		this.clean_frequency = 3;
	}

	// In this constructor the user can specify how many sounds they want.

	playStationary(filename, looping, persistent = false) {
		return this.playStationaryExtended(filename, looping, 0, 0, 100, 100, persistent);
	}

	playStationaryExtended(filename, looping, offset, start_pan, start_volume, start_pitch, persistent = false) {
		const slot = this.reserve_slot();
		if (slot == -1) {
			return -1;
		}
		console.log('slot' + slot);
		this.items.splice(slot, 0, new SoundPoolItem(filename));
		this.items[slot].looping = looping;
		this.items[slot].stationary = true;
		this.items[slot].start_offset = offset;
		this.items[slot].start_pan = start_pan;
		this.items[slot].start_volume = start_volume;
		this.items[slot].start_pitch = start_pitch;
		this.items[slot].persistent = persistent;
		if (this.items[slot].start_offset > 0) {
			this.items[slot].handle.seek(this.items[slot].start_offset);
		}
		if (start_pan != 0.0) {
			this.items[slot].handle.pan = start_pan / 100;
		}
		if (start_volume < 100.0) {
			this.items[slot].handle.volume = start_volume / 100;
		}
		this.items[slot].handle.pitch = start_pitch / 100;
		if (looping == true) {
			this.items[slot].handle.play();
			this.items[slot].handle.loop = true;
		} else {
			this.items[slot].handle.play();
		}
		if (slot > this.highest_slot) {
			this.highest_slot = slot;
		}
		return slot;
	}

	reserve_slot() {
		// This finds the first available sound slot && prepares it for use.
		this.clean_frequency -= 1;
		if (this.clean_frequency == 0) {
			this.clean_frequency = 3;
			this.clean_unused();
		}
		let slot = -1;
		const current_length = this.items.length;
		for (let i = 0; i < current_length; i++) {
			if (this.items[i].persistent == true) {
				continue;
			}
			if (this.items[i].looping == true) {
				continue;
			}
			if (typeof this.items[i].handle === 'undefined') {
				slot = i;
				this.items.splice(slot, 1);
				break;
			}
			if (this.items[i].handle.active == false) {
				slot = i;
				this.items.splice(slot, 1);
				break;
			}
			if (this.items[i].handle.playing == false) {
				slot = i;
				this.items.splice(slot, 1);
				break;
			}
		}
		if (slot == -1) {
			slot = current_length;
			return slot;
		}
	}

	play1d(filename, listener_x, sound_x, looping, persistent = false) {
		return this.playExtended1d(filename, listener_x, sound_x, 0, 0, looping, 0, 0, 100, 100, persistent);
	}

	playExtended1d(filename, listener_x, sound_x, left_range, right_range, looping, offset, start_pan, start_volume, start_pitch, persistent = false) {
		const slot = this.reserve_slot();
		if (slot == -1) {
			return -1;
		}
		this.items.splice(slot, 0, new SoundPoolItem(filename));
		this.items[slot].x = sound_x;
		this.items[slot].y = 0;
		this.items[slot].looping = looping;
		this.items[slot].pan_step = this.pan_step;
		this.items[slot].volume_step = this.volume_step;
		this.items[slot].behind_pitch_decrease = 0.0;
		this.items[slot].start_pan = start_pan;
		this.items[slot].start_volume = start_volume;
		this.items[slot].start_pitch = start_pitch;
		this.items[slot].left_range = left_range;
		this.items[slot].right_range = right_range;
		this.items[slot].backward_range = 0;
		this.items[slot].forward_range = 0;
		this.items[slot].max_distance = this.max_distance;
		this.items[slot].is_3d = false;
		this.items[slot].start_offset = offset;
		this.items[slot].persistent = persistent;
		if (this.max_distance > 0 && this.items[slot].get_total_distance(listener_x, 0) > this.max_distance) {
			// We are out of earshot, so we cancel.
			if (looping == false) {
				this.items[slot].destroy();
				this.items.splice(slot, 1);
				return -2;
			}

			this.last_listener_x = listener_x;
			this.items[slot].handle.pitch = start_pitch / 100;
			this.items[slot].update(listener_x, 0);
			if (slot > this.highest_slot) {
				this.highest_slot = slot;
			}
			return this.items[slot].handle;
		}
		this.items[slot].handle.load(this.items[slot].filename);
		if (this.items[slot].handle.active == false) {
			this.items[slot].reset();
			return -1;
		}
		if (this.items[slot].start_offset > 0) {
			this.items[slot].handle.seek(this.items[slot].start_offset);
		}
		this.items[slot].handle.pitch = start_pitch / 100;
		this.last_listener_x = listener_x;
		this.items[slot].update(listener_x, 0);
		if (looping == true) {
			this.items[slot].handle.play();
			this.items[slot].handle.loop = true;
		} else {
			this.items[slot].handle.play();
		}
		if (slot > this.highest_slot) {
			this.highest_slot = slot;
		}
		return this.items[slot].handle;
	}

	play_2d(filename, listener_x, listener_y, sound_x, sound_y, looping, persistent = false) {
		return this.playExtended2d(filename, listener_x, listener_y, sound_x, sound_y, 0, 0, 0, 0, looping, 0, 0, 100, 100, persistent);
	}

	playExtended2d(filename, listener_x, listener_y, sound_x, sound_y, left_range, right_range, backward_range, forward_range, looping, offset, start_pan, start_volume, start_pitch, persistent = false) {
		slot = reserve_slot();
		if (slot == -1) {
			return -1;
		}
		this.items.splice(slot, 0, new SoundPoolItem(filename));
		this.items[slot].x = sound_x;
		this.items[slot].y = sound_y;
		this.items[slot].looping = looping;
		this.items[slot].pan_step = this.pan_step;
		this.items[slot].volume_step = this.volume_step;
		this.items[slot].behind_pitch_decrease = this.behind_pitch_decrease;
		this.items[slot].start_pan = start_pan;
		this.items[slot].start_volume = start_volume;
		this.items[slot].start_pitch = start_pitch;
		this.items[slot].left_range = left_range;
		this.items[slot].right_range = right_range;
		this.items[slot].backward_range = backward_range;
		this.items[slot].forward_range = forward_range;
		this.items[slot].max_distance = this.max_distance;
		this.items[slot].is_3d = true;
		this.items[slot].start_offset = offset;
		this.items[slot].persistent = persistent;
		if (this.max_distance > 0 && this.items[slot].get_total_distance(listener_x, listener_y) > this.max_distance) {
			// We are out of earshot, so we cancel.
			if (looping == false) {
				this.items[slot].destroy();
				this.items.splice(slot, 1);
				return -2;
			}

			this.last_listener_x = listener_x;
			this.last_listener_y = listener_y;
			this.items[slot].update(listener_x, listener_y);
			if (slot > this.highest_slot) {
				this.highest_slot = slot;
			}
			return slot;
		}
		if (this.items[slot].handle.active == false) {
			this.items[slot].destroy();
			this.items.splice(slot, 1);
			return -1;
		}
		if (this.items[slot].start_offset > 0) {
			this.items[slot].handle.seek(this.items[slot].start_offset);
		}
		this.last_listener_x = listener_x;
		this.last_listener_y = listener_y;
		this.items[slot].update(listener_x, listener_y);
		if (looping == true) {
			this.items[slot].handle.play();
			this.items[slot].handle.loop = true;
		} else {
			this.items[slot].handle.play();
		}
		if (slot > this.highest_slot) {
			this.highest_slot = slot;
		}
		return slot;
	}

	soundActive(slot) {
		/*
		   If the looping parameter is set to true && the sound object is inactive, the sound is still considered to be active as this just means that we are currently out of earshot. A non-looping sound that has finished playing is considered to be dead, && will be cleaned up.
		 */
		if (this.verify_slot(slot) == false) {
			return false;
		}
		if (this.items[slot].looping == false && typeof this.items[slot].handle === 'undefined') {
			return false;
		}
		if (this.items[slot].looping == false && this.items[slot].handle.playing == false) {
			return false;
		}
		return true;
	}

	soundPlaying(slot) {
		if (sound_is_active(slot) == false) {
			return false;
		}
		return this.items[slot].handle.playing;
	}

	pause_sound(slot) {
		if (sound_is_active(slot) == false) {
			return false;
		}
		if (this.items[slot].paused == true) {
			return false;
		}
		this.items[slot].paused = true;
		if (this.items[slot].handle.playing == true) {
			this.items[slot].handle.pause();
		}
		return true;
	}

	resume_sound(slot) {
		if (this.verify_slot(slot) == false) {
			return false;
		}
		if (this.items[slot].paused == false) {
			return false;
		}
		this.items[slot].paused = false;
		if (this.items[slot].max_distance > 0 && this.items[slot].get_total_distance(this.last_listener_x, this.last_listener_y) > this.items[slot].max_distance) {
			if (this.items[slot].handle.active == true) {
				this.items[slot].handle.close();
			}
			return true;
		}
		this.items[slot].update(this.last_listener_x, this.last_listener_y);
		if (this.items[slot].handle.active == true && this.items[slot].handle.playing == false) {
			if (this.items[slot].looping == true) {
				this.items[slot].handle.play();
				this.items[slot].handle.loop = true;
			} else {
				this.items[slot].handle.play();
			}
		}
		return true;
	}

	pause_all() {
		let currently_playing = 0;
		const current_length = this.items.length;
		for (let i = 0; i < current_length; i++) {
			if (sound_is_playing(i)) {
				currently_playing += 1;
			}
			this.pause_sound(i);
		}
	}

	resume_all() {
		let currently_playing = 0;
		const current_length = this.items.length;
		for (let i = 0; i < current_length; i++) {
			resume_sound(i);
			if (sound_is_playing(i)) {
				currently_playing += 1;
			}
		}
	}

	destroy_all() {
		for (let i = 0; i < this.items.length; i++) {
			this.items[i].destroy();
		}
		this.highest_slot = 0;
		this.items.splice();
	}

	updateListener1d(listener_x) {
		this.updateListener2d(listener_x, 0);
	}

	updateListener2d(listener_x, listener_y) {
		if (this.items.length() == 0) {
			return;
		}
		this.last_listener_x = listener_x;
		this.last_listener_y = listener_y;
		for (let i = 0; i <= this.highest_slot; i++) {
			this.items[i].update(listener_x, listener_y);
		}
	}

	update_sound_1d(slot, x) {
		return this.update_sound_2d(slot, x, 0);
	}

	update_sound_2d(slot, x, y) {
		if (this.verify_slot(slot) == false) {
			return false;
		}
		this.items[slot].x = x;
		this.items[slot].y = y;
		this.items[slot].update(this.last_listener_x, this.last_listener_y);
		return true;
	}

	update_sound_start_values(slot, start_pan, start_volume, start_pitch) {
		if (this.verify_slot(slot) == false) {
			return false;
		}
		this.items[slot].start_pan = start_pan;
		this.items[slot].start_volume = start_volume;
		this.items[slot].start_pitch = start_pitch;
		this.items[slot].update(this.last_listener_x, this.last_listener_y);
		if (this.items[slot].stationary == true && typeof this.items[slot].handle !== 'undefined') {
			this.items[slot].handle.pan = start_pan / 100;
			this.items[slot].handle.volume = start_volume / 100;
			this.items[slot].handle.pitch = start_pitch / 100;
			return true;
		}
		if (this.items[slot].is_3d == false && this.items[slot].handle.pitch * 100 != start_pitch) {
			this.items[slot].handle.pitch = start_pitch / 100;
		}
		return true;
	}

	update_sound_range_1d(slot, left_range, right_range) {
		return update_sound_range_2d(slot, left_range, right_range, 0, 0);
	}

	update_sound_range_2d(slot, left_range, right_range, backward_range, forward_range) {
		if (this.verify_slot(slot) == false) {
			return false;
		}
		this.items[slot].left_range = left_range;
		this.items[slot].right_range = right_range;
		this.items[slot].backward_range = backward_range;
		this.items[slot].forward_range = forward_range;
		this.items[slot].update(this.last_listener_x, this.last_listener_y);
		return true;
	}

	destroy_sound(slot) {
		if (this.verify_slot(slot) == true) {
			this.items[slot].destroy();
			if (slot == this.highest_slot) {
				find_highest_slot(this.highest_slot);
			}
			return true;
		}
		return false;
	}

	// Internal properties.

	// Internal methods.

	find_highest_slot(limit) {
		/*
		   If the looping parameter is set to true && the sound object is inactive, the sound is still considered to be active as this just means that we are currently out of earshot. A non-looping sound that has finished playing is considered to be dead, && will be cleaned up.
		 */
		highest_slot = 0;
		for (let i = 0; i < limit; i++) {
			if (this.items[i].looping == false && typeof this.items[i].handle === 'undefined') {
				continue;
			}
			if (this.items[i].looping == false && this.items[i].handle.playing == false) {
				continue;
			}
			highest_slot = i;
		}
	}

	clean_unused() {
		/*
		   If the looping parameter is set to true && the sound object is inactive, the sound is still considered to be active as this just means that we are currently out of earshot. A non-looping sound that has finished playing is considered to be dead, && will be cleaned up if it is not set to be persistent.
		 */
		if (this.items.length() == 0) {
			return;
		}
		const limit = this.highest_slot;
		let killed_highest_slot = false;
		for (let i = 0; i <= limit; i++) {
			if (this.items[i].persistent == true) {
				continue;
			}
			if (this.items[i].looping == true) {
				continue;
			}
			if (typeof this.items[i].handle === 'undefined') {
				continue;
			}
			if (this.items[i].handle.active == false) {
				continue;
			}
			if (this.items[i].handle.playing == false && this.items[i].paused == false) {
				if (i == this.highest_slot) {
					killed_highest_slot = true;
				}
				this.items[i].destroy();
				this.items.splice(i, 1);
			}
		}
		if (killed_highest_slot == true) {
			find_highest_slot(this.highest_slot);
		}
	}

	verify_slot(slot) {
		// This is a security function to perform basic sanity checks.
		if (slot < 0) {
			return false;
		}
		if (slot >= this.items.length()) {
			return false;
		}
		if (this.items[slot].persistent == true) {
			return true;
		}
		if (this.items[slot].looping == true) {
			return true;
		}
		if (typeof this.items[slot].handle !== 'undefined') {
			return true;
		}
		return false;
	}
}
export { SoundPool };
