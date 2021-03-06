import React from 'react'
import { Card, SearchField, Drawer } from 'ui-utils'

function CardSetTable({slice, maxrows}) {
    return (<table className="mdl-data-table mdl-js-data-table mdl-data-table--selectable" style={{display:"inline-block",marginLeft:"1rem",marginRight:"1rem"}}>
	    <thead>
	    <tr>
	    <th className="mdl-data-table__cell--non-numeric">Set Name</th>
	    </tr>
	    </thead>
	    <tbody>
	    {( _ => {
		let rows = slice.map(o => {
		    
		    return (<tr key={o.id}>
			    <td className="mdl-data-table__cell--non-numeric" data-id={o.id}>{o.label}</td>
			    </tr>)
		})
		let j = rows.length;
		while(j < maxrows) {
		    rows.push(<tr key={j + "_blank"}></tr>);
		    j++
		}
		return rows;
	    })()
	    }
	    </tbody>
	    </table>)
}


function partitioncardsets(cardsets, maxrows) {
    let i = 0;
    maxrows = maxrows || 5;
    let tables = [];
    while(i < cardsets.length) {
	let slice = cardsets.slice(i, i+ maxrows);
	tables.push((_ => <CardSetTable slice={slice} maxrows={maxrows} key={"table_" + i}/>)())
	
	i = i + maxrows;
    }

    return tables;
}


function CardSetNameView({cardsets,is_building,clickhandler}) {
    const maxRows = 5;
    if(cardsets) {
	//let tables = partitioncardsets(cardsets);
	
	
	return (<div className="cardset-selector">
		<div className="mdl-grid">
		<div className="mdl-cell mdl-cell--12-col">
		{( _ => {
		    return cardsets.map( ({id, label}) => {
			let box_id = `checkbox_${id}`
			return (<div className="mdl-card card-set-label mdl-shadow--2dp">
				<div className="mdl-card__title">
				<p className="mdl-card__title-text">
				{label}
				</p>
				</div>
				<div className="mdl-card__actions">
				<label className="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" htmlFor={box_id} data-id={id}>
				<input type="checkbox" id={box_id} className="mdl-checkbox__input"></input>
				<span className="mdl-checkbox__label"></span>
				</label>
				</div>
				</div>)
		    })
		})()}
		</div>
		</div>
		{( _ => {
		    if(is_building) {
			return <div className="mdl-spinner mdl-js-spinner is-active"></div>
		    }
		    return (<button className="mdl-button mdl-js-button mdl-button--raised"
			    style={{display:"inline-block",marginLeft:"1rem",marginRight:"1rem"}}
			    onClick={clickhandler}>Update Set View</button>)
		    
		})()
		}
		</div>)
    }
    return null;

}


function CardSetView({cardset_coll,cardset_filter,filter_to_deck,filter_owned,filter_unowned,deck,addhandler,addhandler2,removehandler2, menuOpts, menuHandler,show_title, viewable}) {
    let cardset = cardset_coll;
    if(cardset_filter) {
	try {
	    let re = new RegExp(cardset_filter);
	    cardset = cardset.filter(card => re.test(card.abilities) || re.test(card.number) || re.test(card.name))
	}
	catch(e) {
	    console.log(e)
	}
	
    }
    if(filter_to_deck && deck) {
	cardset = cardset.filter(card => deck.filter( ({id:deck_id}) => deck_id === card.id).length > 0)
    }
    if(filter_unowned) {
	cardset = cardset.filter(card => card.ownership === undefined || card.ownership.count === 0)
    }
    if(filter_owned) {
	cardset = cardset.filter(card => card.ownership && card.ownership.count > 0)
    }
    if(viewable)
	cardset = cardset.slice(0,viewable)
    
    console.time('mapper')
    const set = cardset.map((card, index) => {
	let display_props = {}

	let count = card.ownership ? ( card.ownership.count == 0 ? card.ownership.price : card.ownership.count ) : "No Info";
	
	let props = {};
	if(deck) {
	    if(deck.filter( ({id}) => card.id === id).length === 0) {
		props.addhandler = addhandler;
	    }
	}
	return (<div className="mdl-cell mdl-cell--3-col-desktop mdl-cell--2-col-phone mdl-cell--2-col-tablet  card-set-cell" key={card.number} {...display_props}>
		<Card show_title={show_title} {...card} {...props} count={count} addhandler2={addhandler2} removehandler2={removehandler2} menuOpts={menuOpts} menuHandler={( _ => {
		    if(menuHandler)
			return menuHandler(card)
		})()} actions={<button onClick={
		    evt => {
			document.querySelector(`#dialog-abilities-${card.id}`).showModal()
		    }
		} className="mdl-button mdl-js-button mdl-button--icon alt-display"><i className="material-icons">info</i></button>}>
		
		{(_ => {
 		    if(card.abilities) {
			let i = 0;
 			return card.abilities.map( text => <p key={"ability_text_" + i++}>{text}</p>)
		    }
		})()}
	
		

		</Card>
		<dialog className="mdl-dialog" id={`dialog-abilities-${card.id}`}>
		<div className="mdl-dialog__supporting-text">
		{(_ => {
 		    if(card.abilities) {
			let i = 0;
 			return card.abilities.map( text => <p key={"ability_text_" + i++}>{text}</p>)
		    }
		})()}
		</div>
		<div className="mdl-dialog__actions">
		<button className="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab" onClick={evt => { document.querySelector(`#dialog-abilities-${card.id}`).close()  }}>
		<i className="material-icons">close</i>
		</button>
		</div>
		</dialog>
		</div>)
    })
    console.timeEnd('mapper')
    return set;
}

/*
required props

updateCardView - function called when series are selected
filterCardSet - function  called when the user enters SearchField Input
addFilterOptions - function returns array of additional filter options to display

*/
function buildCardSet(props) {
    return (<div className="mdl-grid card-set-view">
	    <div className="mdl-cell mdl-cell--12-col card-set-names">
	    {( _ => {
		if(!props.hide_name_view)
		    return <CardSetNameView {...props} clickhandler={props.updateCardView} />
	    })()}
	    
	    </div>
	    <div className="mdl-cell mdl-cell--12-col card-set-options">
 	    <SearchField value={props.cardset_filter} changehandler={props.filterCardSet}/>
	    {(_ => {
		if(props.addFilterOptions)
		    return props.addFilterOptions
	    })()
	    }

	    </div>
	    {( _ => {
		if(props.cardset && props.cardset_coll) 
		    return <CardSetView {...props} />
	    })()}
	    </div>)
}


export { CardSetView, CardSetNameView,  buildCardSet }
