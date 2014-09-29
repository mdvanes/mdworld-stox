<?php
namespace WebSocket\Application;

/**
 * Shiny WSS Status Application
 * Provides live server infos/messages to client/browser.
 * 
 * @author Simon Samtleben <web@lemmingzshadow.net>
 */
class StoxApplication extends Application
{
    private $_clients = array();
	private $_serverClients = array();
	private $_serverInfo = array();
	private $_serverClientCount = 0;

	public function onConnect($client)
    {
		$id = $client->getClientId();
        $this->_clients[$id] = $client;
		//$this->_sendServerinfo($client);
        $encodedData = $this->_encodeData('identify', $client->getClientPort());
        $client->send($encodedData);
    }

    public function onDisconnect($client)
    {
        $id = $client->getClientId();		
		unset($this->_clients[$id]);     
    }

    public function onData($data, $client)
    {		
        $decodedData = $this->_decodeData($data);
		if($decodedData === false)
		{
			// @todo: invalid request trigger error...
            echo "invalid request trigger error...";
		}
		
		$actionName = '_action' . ucfirst($decodedData['action']);
		if(method_exists($this, $actionName))
		{			
			call_user_func(array($this, $actionName), $decodedData);
		}
    }

	private function _actionIdentify($decodedData)
	{		
		//$text = $decodedData['data'];
		foreach($this->_clients as $client)
		{
			$encodedData = $this->_encodeData('identify', $client->getClientPort());
			$client->send($encodedData);
        }
	}

	private function _actionUpdateStock($decodedData)
	{		
		$text = $decodedData['data'];
		foreach($this->_clients as $sendto)
		{
			$payload = array(
				'action' => 'updateStock',
				'data' => $text,
				'for' => $decodedData['for']
			);
			$encodedData = json_encode($payload);
			$sendto->send($encodedData);
        }
	}

	private function _actionSendNotification($decodedData)
	{
        /*echo "sendNotification";*/
		foreach($this->_clients as $client)
		{
			if( $client->getClientPort() == $decodedData['to'] ) {
				$payload = array(
					'action' => 'receiveNotification',
					'data' => $decodedData['data']
				);
				$encodedData = json_encode($payload);
				$client->send($encodedData);
			}
        }
	}
	
    private function _actionSendMouse($decodedData)
    {
        foreach($this->_clients as $client)
        {
            $payload = array(
                'action' => 'receiveMouse',
                'data' => $decodedData['data'],
                'mouseY' => $decodedData['mouseY'],
                'mouseX' => $decodedData['mouseX'],
                'from' => $decodedData['from']
            );
            $encodedData = json_encode($payload);
            $client->send($encodedData);
        }
    }
}