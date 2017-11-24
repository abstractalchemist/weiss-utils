import React from 'react'
import { Card, SearchField } from 'ui-utils'

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
	let tables = partitioncardsets(cardsets);
	
	
	return (<div id="cardset-selector">
		{tables}
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


function CardSetView({cardset_coll,cardset_filter,filter_to_deck,filter_owned,filter_unowned,deck,addhandler,addhandler2,removehandler2, menuOpts, menuHandler}) {
    let cardset = cardset_coll;
    if(cardset_filter) {
	try {
	    let re = new RegExp(cardset_filter);
	    cardset = cardset.filter( card => {
		
		return re.test(card.abilities) || re.test(card.number) || re.test(card.name);
	    });
	}
	catch(e) {
	    console.log(e)
	}
	
    }
    if(filter_to_deck && deck) {
	cardset = cardset.filter( ({id}) => {
	    return deck.filter( ({id:deck_id}) => deck_id === id).length > 0;
	})
    }
    if(filter_owned) {
	cardset = cardset.filter( ( { ownership : { count } } ) => {
	    return count > 0;
	})
    }
    if(filter_unowned) {
	cardset = cardset.filter( ( { ownership : { count } } ) => {
	    return count === 0;
	})
	
    }
    return cardset.map(card => {
	

	let count = card.ownership ? ( card.ownership.count == 0 ? card.ownership.price : card.ownership.count ) : "No Info";
	
	let props = {};
	if(deck) {
	    if(deck.filter( ({id}) => card.id === id).length === 0) {
		props.addhandler = addhandler;
	    }
	}
	return (<div className="mdl-cell mdl-cell--3-col" style={{ maxWidth: "250px" }} key={card.number}>
		<Card {...card} {...props} count={count} addhandler2={addhandler2} removehandler2={removehandler2} menuOpts={menuOpts} menuHandler={( _ => {
		    if(menuHandler)
			return menuHandler(card)
		})()}>
		{(_ => {
 		    if(card.abilities) {
			let i = 0;
 			return card.abilities.map( text => <p key={"ability_text_" + i++} style={{fontSize:"10px",lineHeight:"12px"}}>{text}</p>)
		    }
		})()}
		</Card>
		</div>)
    })

}

/*
required props

updateCardView - function called when series are selected
filterCardSet - function  called when the user enters SearchField Input
addFilterOptions - function returns array of additional filter options to display

*/
function buildCardSet(props) {
    return (<div className="mdl-grid">
	    <div className="mdl-cell mdl-cell--6-col">
	    {( _ => {
		if(!props.hide_name_view)
		    return <CardSetNameView {...props} clickhandler={props.updateCardView} />
	    })()}
	    
	    </div>
	    <div className="mdl-cell mdl-cell--6-col">
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
