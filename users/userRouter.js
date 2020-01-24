const express = require('express');
const db = require('./userDb')
const posts = require('../posts/postDb')

const router = express.Router();



router.post('/', validateUser, (req, res) => {
  const { name } = req.body;

  db.insert( name )
    .then(user => {
      res.status(200).json(user);
    })
    .catch(error => {
      res.status(500).json({
        success: false,
        errorMessage: "No user added", error })
    })
});

//-----------------------//

router.get('/', (req, res) => {
  db.get()
  .then(users => {
    res.status(200).json(users)
  })
  .catch(error => {
    res.status(500).json({
      success: false, 
      errorMessage: "Unable to pull from Data base", error})
  })
});


//-----------------------//
router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user)
});

//-----------------------//

router.get('/:id/posts', validateUserId, (req, res) => {

  db.getUserPosts(req.user.id)
  .then(posts => {
    if (posts.length > 0) {
      res.status(200).json(posts);
    }
    else {
      res.status(400).json({
        success: false, 
        errorMessage: "No posts available" 
      });
    }
  })
  .catch(error => {
    res.status(500).json({ 
      success: false,
      errorMessage: "No posts retrieved", error
    });
  });
});

//-----------------------//

router.delete('/:id', validateUserId, (req, res) => {
 
  db.remove(req.user.id)
  .then(() => {
    res.status(200).json({ 
      success: true,
      message: `user with id ${req.user.id} was deleted` 
    });
  })
  .catch(error => {
    res.status(500).json({ 
      success: false,
      errorMessage: "Couldn't delete the user", error
     });
  });
});


//-----------------------//
router.put('/:id', (req, res) => {

  db.update(req.params.id, req.body)
  .then(() => {
    db.getById(req.params.id)
      .then(user => {
        res.status(200).json(user);
      })
  })
  .catch(error => {
    res.status(500).json({
      success: false, 
      errorMessage: "Could not retrieve update user", error 
    });
  });
});

//-----------------------//
router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  posts.insert (req.params.id, req.body.text )
  .then(post => {
    res.status(200).json({ 
      message: post 
    });
  })
  .catch(error => {
    res.status(500).json({ 
      errorMessage: "Could not post", error
     });
  });
});

//custom Validate Middleware//

//ValidateUserId//
//-----------------------//

function validateUserId(req, res, next) {
  db.getById(req.params.id)
    .then(user => {
      if (user) {
        req.user = user;
        next();
      }
      else {
        res.status(500).json({ 
          errorMessage: "No user with this ID exists" 
        });
      };
    })
    .catch(error => {
      res.status(500).json({ 
        errorMessage: "Id required", error
      });
    });
};


//-----------------------//
//ValidateUser//
//-----------------------//

function validateUser(req, res, next) {

  if (req.body) {
    if (req.body.name) {
      next();
    }
    else {
      res.status(400).json({ 
        errorMessage: "Missing name" 
      })
    }
  } else {
    res.status(400).json({ 
      errorMessage: "Missing user data" 
    });
  };
};

//-----------------------//
//ValidatePost//
//-----------------------//

function validatePost(req, res, next) {
  if (req.body) {
    if (req.body.text) {
      next();
    } else {
      res.status(400).json({ 
        errorMessage: "Missing required text field" 
      });
    }
  } else {
    res.status(400).json({ 
      errorMessage: "Missing post data" 
    });
  };
};



module.exports = router;

