import React from 'react'
import { expect } from 'chai'
import { mount } from 'enzyme'
import { CardSetView, CardSetNameView,  buildCardSet } from '../src/index'


describe('<CardSetView>', function() {
    xit('init', function() {
	const obj = mount(<CardSetView cardset_coll={[{},{},{},{},{},{}]} cardset_filter="" filter_to_deck={false} deck={[]} addhandler={
	    _ => {
	    }
	}
			  addhandler2={
			      _ => {
			      }
			  }/>);
	expect(obj).to.not.be.null;
	expect(obj.find("Card")).to.have.lengthOf(6);
    })

    xit('filter', function() {
	const obj = mount(<CardSetView cardset_coll={[{abilities:["filter this"]},{},{},{},{},{}]} cardset_filter="filter" filter_to_deck={false} deck={[]} addhandler={
	    _ => {
	    }
	}
			  addhandler2={
			      _ => {
			      }
			  }/>);

	expect(obj.find("Card")).to.have.lengthOf(1);
	expect(obj.find("Card div.mdl-card__supporting-text").text()).to.equal("filter this");
    })

    xit('filter to deck', function() {
	const obj = mount(<CardSetView cardset_coll={[{id:1},{id:2},{id:3},{id:4},{id:5},{id:6}]} cardset_filter="" filter_to_deck={true} deck={[{id:1}]} addhandler={
	    _ => {
	    }
	}
			  addhandler2={
			      _ => {
			      }
			  }/>);

	expect(obj.find("Card")).to.have.lengthOf(1);

    })
})


describe('<CardSetNameView>', function() {
    it('init', function() {
	const obj = mount(<CardSetNameView cardsets={[]} is_building={false} clickhandler={
	    _ => {
	    }
	}/>);
	expect(obj).to.not.be.null;
    })

    it('test progress', function() {
	const obj = mount(<CardSetNameView cardsets={[]} is_building={true} clickhandler={
	    _ => {
	    }
	}/>);

	expect(obj.find("button")).to.have.lengthOf(0);
	expect(obj.find(".mdl-spinner")).to.have.lengthOf(1);
    })

    
})

describe('buildCardSet', function() {
    it('init', function() {
	const view = mount(buildCardSet({}))
	expect(view).to.not.be.null;
    })
})
